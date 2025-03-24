;; contracts/subscription-treasury.clar
;; A contract to securely handle subscription fees

;; Define admin as the contract deployer
(define-data-var admin principal tx-sender)

;; Total funds in treasury
(define-data-var total-funds uint u0)

;; Function to deposit funds into treasury
(define-public (deposit (amount uint))
  (begin
    ;; Transfer STX from sender to this contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    ;; Update total funds
    (var-set total-funds (+ (var-get total-funds) amount))
    
    ;; Return success
    (ok amount)))

;; Allow admin to withdraw funds
(define-public (withdraw (amount uint) (recipient principal))
  (begin
    ;; Check if caller is admin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    
    ;; Check if amount is available
    (asserts! (<= amount (var-get total-funds)) (err u404))
    
    ;; Transfer STX from contract to recipient
    (as-contract 
      (begin
        (try! (stx-transfer? amount tx-sender recipient))
        (var-set total-funds (- (var-get total-funds) amount))
        (ok amount)
      ))))

;; Get total treasury balance
(define-read-only (get-total-funds)
  (var-get total-funds))

;; Set new admin
(define-public (set-treasury-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok u1)))
