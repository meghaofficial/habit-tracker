import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

interface Review {
  id: string;
  name: string;
  subtitle: string;
  review: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Alex",
    subtitle: "Verified user",
    review:
      "Habitify helps me stay consistent with my daily routine. I love tracking my progress.",
    rating: 5,
  },
  {
    id: "2",
    name: "Sam",
    subtitle: "User feedback",
    review: "The monthly dashboard gives me a clear picture of my progress.",
    rating: 4.5,
  },
];

const Reviews = () => {
  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1280px]">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-6 backdrop-blur-2xl light:bg-lightCard light:border-lightBorder sm:px-6"
        >
          {/* Badge */}
          <span className="inline-flex rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-300">
            Reviews
          </span>

          {/* Heading */}
          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
            What people say about Habitify
          </h1>

          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Real experiences from people building better habits.
          </p>

          {/* Rating Summary */}
          <div className="mt-5 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                size={18}
                className={
                  star <= 4
                    ? "fill-indigo-400 text-indigo-400"
                    : "text-gray-300"
                }
              />
            ))}

            <span className="ml-1 text-xs text-gray-400">User feedback</span>
          </div>
        </motion.div>

        {/* Reviews List */}
        <div className="mt-5 space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
  index: number;
}

const ReviewCard = ({ review, index }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
      }}
      className="rounded-2xl border border-white/10 bg-black/20 px-5 py-5 backdrop-blur-2xl transition-colors hover:border-indigo-400/20 light:bg-lightCard light:border-lightBorder sm:px-6"
    >
      {/* User + Rating */}
      <div className="flex items-center justify-between gap-4">
        {/* User */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
            {review.name.slice(0, 1).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-200">
              {review.name}
            </h3>

            <p className="mt-0.5 text-[11px] text-gray-500">
              {review.subtitle}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex shrink-0 items-center gap-1.5">
          <FiStar size={16} className="fill-indigo-400 text-indigo-400" />

          <span className="text-xs text-gray-400">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <p className="mt-4 text-sm leading-relaxed text-gray-300">
        "{review.review}"
      </p>
    </motion.div>
  );
};

export default Reviews;
