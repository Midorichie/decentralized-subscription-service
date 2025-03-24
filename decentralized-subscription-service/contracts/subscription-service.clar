;; contracts/subscription-service.clar
;; Define a constant fee for subscribing (in micro-STX)
(define-constant SUBSCRIPTION_FEE u1000000)
;; Define the subscription duration in blocks (e.g., 30 days, assuming ~1 block per minute)
(define-constant SUBSCRIPTION_DURATION u43200)
;; Map to store active subscriptions: subscriber principal -> expiry block height
(define-map subscriptions { subscriber: principal } { expiry: uint })
;; Admin variable for potential future admin functions
(define-data-var admin principal tx-sender)
;; Public function to subscribe
(define-public (subscribe)
  (let (
        (current-block burn-block-height)
       )
    (if (>= (stx-get-balance tx-sender) SUBSCRIPTION_FEE)
        (begin
          ;; In a full implementation, you would transfer tokens to the admin or a treasury here
          (map-set subscriptions { subscriber: tx-sender } { expiry: (+ current-block SUBSCRIPTION_DURATION) })
          (ok "Subscription successful"))
        (err "Insufficient STX balance"))))
;; Public function to cancel a subscription
(define-public (cancel-subscription)
  (match (map-get? subscriptions { subscriber: tx-sender })
    subscription-data
      (begin
        (map-delete subscriptions { subscriber: tx-sender })
        (ok "Subscription cancelled"))
    (err "No active subscription")))
;; Read-only function to check subscription status
(define-read-only (check-subscription (user principal))
  (match (map-get? subscriptions { subscriber: user })
    subscription-data
      (if (>= burn-block-height (get expiry subscription-data))
          (err "Subscription expired")
          (ok subscription-data))
    (err "No subscription found")))
