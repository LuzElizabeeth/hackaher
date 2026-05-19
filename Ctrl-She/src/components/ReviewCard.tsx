import { Star } from "lucide-react";
import type { Review } from "../types";

export default function ReviewCard({ review }: { review: Review }) {
  const rating = Math.max(0, Math.min(5, review.rating || 0));

  return (
    <article className="review-item-card">
      <div className="review-item-top">
        <div className="review-author">
          <strong>{review.author}</strong>
          <span>Cliente verificado</span>
        </div>

        <div className="review-stars-display" aria-label={`${rating} de 5 estrellas`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              fill={value <= rating ? "currentColor" : "none"}
              strokeWidth={2}
            />
          ))}
        </div>
      </div>

      <p>{review.text}</p>
    </article>
  );
}