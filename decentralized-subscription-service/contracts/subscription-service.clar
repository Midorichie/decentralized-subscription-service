;; contracts/subscription-service.clar
;; Define a constant fee for subscribing (in micro-STX)
(define-constant SUBSCRIPTION_FEE u1000000)
;; Define the subscription duration in blocks (e.g., 30 days, assuming ~1 block per minute)
(define-constant SUBSCRIPTION_DURATION u43200)
;; Map to store active subscriptions: subscriber principal -> expiry block height
(define-map subscriptions { subscriber: principal } { expiry: uint })
;; Admin variable for contract control
(define-data-var admin principal tx-sender)

;; Public function to subscribe
(define-public (subscribe)
  (let (
        (current-block burn-block-height)
       )
    (begin
      ;; Check if user has enough balance
      (asserts! (>= (stx-get-balance tx-sender) SUBSCRIPTION_FEE) (err u1))
      ;; Transfer tokens to the contract
      (try! (stx-transfer? SUBSCRIPTION_FEE tx-sender (as-contract tx-sender)))
      ;; Update subscription status
      (map-set subscriptions { subscriber: tx-sender } { expiry: (+ current-block SUBSCRIPTION_DURATION) })
      (ok u1))))

;; Public function to cancel a subscription
(define-public (cancel-subscription)
  (match (map-get? subscriptions { subscriber: tx-sender })
    subscription-data
      (begin
        (map-delete subscriptions { subscriber: tx-sender })
        (ok u1))
    (err u0)))

;; Fixed read-only function to check subscription status
(define-read-only (check-subscription (user principal))
  (match (map-get? subscriptions { subscriber: user })
    subscription-data
      (let ((expiry-block (get expiry subscription-data))
            (current-block burn-block-height))
        (ok {
          active: (<= current-block expiry-block),
          expiry: expiry-block,
          remaining-blocks: (if (> expiry-block current-block)
                               (- expiry-block current-block)
                               u0)
        }))
    (err "No subscription found")))

;; Admin functions for security
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok u1)))

;; Allow admin to extend a subscription (e.g., for customer service)
(define-public (extend-subscription (user principal) (additional-blocks uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (match (map-get? subscriptions { subscriber: user })
      subscription-data 
        (begin
          (map-set subscriptions 
                  { subscriber: user } 
                  { expiry: (+ (get expiry subscription-data) additional-blocks) })
          (ok u1))
      (err u404))))

;; Allow admin to withdraw funds
(define-public (withdraw-funds (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (as-contract 
      (begin
        (try! (stx-transfer? amount tx-sender recipient))
        (ok amount)
      ))))
