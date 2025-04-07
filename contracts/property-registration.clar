;; Property Registration Contract
;; Records land boundaries and ownership

;; Define data structures
(define-map properties
  { property-id: (string-ascii 32) }
  {
    owner: principal,
    boundaries: (string-ascii 256),
    registration-date: uint,
    status: (string-ascii 10)
  }
)

;; Register a new property
(define-public (register-property (property-id (string-ascii 32)) (boundaries (string-ascii 256)))
  (let ((current-owner tx-sender))
    (if (is-some (map-get? properties { property-id: property-id }))
      (err u1) ;; Property already exists
      (begin
        (map-set properties
          { property-id: property-id }
          {
            owner: current-owner,
            boundaries: boundaries,
            registration-date: block-height,
            status: "active"
          }
        )
        (ok true)
      )
    )
  )
)

;; Get property details
(define-read-only (get-property (property-id (string-ascii 32)))
  (map-get? properties { property-id: property-id })
)

;; Update property boundaries
(define-public (update-boundaries (property-id (string-ascii 32)) (new-boundaries (string-ascii 256)))
  (let ((property (map-get? properties { property-id: property-id })))
    (if (and (is-some property) (is-eq (get owner (unwrap-panic property)) tx-sender))
      (begin
        (map-set properties
          { property-id: property-id }
          (merge (unwrap-panic property) { boundaries: new-boundaries })
        )
        (ok true)
      )
      (err u2) ;; Not the owner or property doesn't exist
    )
  )
)

;; Transfer property ownership
(define-public (transfer-property (property-id (string-ascii 32)) (new-owner principal))
  (let ((property (map-get? properties { property-id: property-id })))
    (if (and (is-some property) (is-eq (get owner (unwrap-panic property)) tx-sender))
      (begin
        ;; Update ownership
        (map-set properties
          { property-id: property-id }
          (merge (unwrap-panic property) { owner: new-owner })
        )
        (ok true)
      )
      (err u3) ;; Not the owner or property doesn't exist
    )
  )
)
