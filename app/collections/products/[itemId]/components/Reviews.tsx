"use client"
import React, {useEffect, useState} from "react";
import EmptyState from "@/components/EmptyState";
import {IoClose} from "react-icons/io5";
import ReCAPTCHA from "react-google-recaptcha";
import ReactStars from 'react-stars'
import {addNewReview, deleteReview, getAllReviewsById} from "@/actions/itemDetailsAction";
import Skeleton from "@/components/Skeleton";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {Review} from "@/interfaces";
import ReviewCard from "./ReviewCard";
import {setShowLoginForm} from "@/redux/authSlice/authSlice";


const Reviews = ({itemId}: { itemId: string }) => {
    const {user} = useSelector((state: RootState) => state.authSlice);
    const dispatch:AppDispatch = useDispatch();
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState(false); // For tracking CAPTCHA errors
    const recaptchaRef = React.createRef<ReCAPTCHA>();
    const [rating, setRating] = useState(5)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [reviewReport, setReviewReport] = useState<{
        reviews: Review[];
        totalReviews: number;
        isUserReviewed: boolean;
        userReview: Review | null;
    }>({
        reviews: [],
        totalReviews: 0,
        isUserReviewed: false,
        userReview: null
    })

    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleAddReviewClick = () => {
        if(user?.isAnonymous){
            dispatch(setShowLoginForm(true));
            return;
        }else {
            setShowReviewForm((prev) => !prev);
        }
    };
    const onReviewDelete = async (reviewId: string) => {
        try {
            const b = confirm("Are you sure you want to delete this review?");
            if (!b) return;
            await deleteReview(reviewId);
            fetchReviews();
        } catch (e) {
            console.error("Failed to delete review: ", reviewId, e);
        }
    }
    const submitReview = async (evt) => {
        evt.preventDefault();
        try {
            setIsProcessing(true);
            if (!captchaValue) {
                setCaptchaError(true);
                return;
            }
            const formData = new FormData(evt.target);
            const name = formData.get("name") as string || "Anonymous";
            const review = formData.get("review") as string;
            const userId = user?.uid;

            const newReview: Review = {
                reviewId: "rev-" + Math.random().toString(36).substring(2, 9),
                rating: rating,
                itemId: itemId,
                review: review,
                updatedAt: new Date().toLocaleString(),
                createdAt: new Date().toLocaleString(),
                userId: userId,
                userName: name
            }

            await addNewReview(newReview, captchaValue);
            evt.target.reset();
            recaptchaRef.current?.reset();
            setCaptchaValue(null);
            setShowReviewForm(false);
            fetchReviews();
        } catch (e) {
            console.error("Failed to submit review: ", e);
        }finally {
            setIsProcessing(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res: {
                reviews: Review[],
                totalReviews: number,
                isUserReviewed: boolean,
                userReview: Review | null
            } = await getAllReviewsById(itemId);
            setReviewReport({
                reviews: res.reviews,
                totalReviews: res.totalReviews,
                isUserReviewed: res.isUserReviewed,
                userReview: res.userReview
            })
            console.log("Reviews: ", res);
            setReviewReport(res);
        } catch (e) {
            console.error("Failed to fetch reviews: ", e);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchReviews();
        }
    }, [user]);

    return (
        <section className="py-10" id={"rating"}>
            <div className="flex w-full justify-between items-center">
                <h2 className="text-2xl tracking-wide font-bold text-gray-900">
                    Reviews ({reviewReport.totalReviews})
                </h2>
                <button
                    disabled={reviewReport.isUserReviewed || isProcessing || !user}
                    onClick={handleAddReviewClick}
                    className="text-white md:text-sm text-xs md:px-4 px-2 py-1  disabled:cursor-not-allowed disabled:bg-opacity-60 md:py-2 rounded-md shadow-md bg-primary-100 hover:bg-primary-200"
                >
                    {reviewReport.isUserReviewed ? "Already Reviewed" : "Add Review"}
                    {!user && " (User Loading)"}
                </button>
            </div>
            <div className="w-full pt-10">
                {(reviewReport.reviews.length <= 0 && !isLoading && !reviewReport.userReview) ? (
                    <EmptyState heading="No reviews available"/>
                ) : (
                    <ul className="flex-row flex flex-wrap lg:gap-10 md:gap-6 gap-2 w-full hide-scrollbar overflow-x-auto">
                        {reviewReport.userReview && (
                            <li className="p-4 shadow-sm rounded-lg" key={0}>
                                <ReviewCard onDelete={onReviewDelete} review={reviewReport.userReview}
                                            userReviewId={reviewReport.userReview.reviewId}/>
                            </li>
                        )}
                        {reviewReport.reviews.map((review, index) => (
                            <li key={index} className="p-4 shadow-sm rounded-lg">
                                <ReviewCard onDelete={onReviewDelete} review={review}
                                            userReviewId={reviewReport.userReview?.reviewId || ""}/>
                            </li>
                        ))}
                    </ul>
                )}
                {isLoading && (<div className="lg:h-48 md:h-32 h-28 w-full"><Skeleton/></div>)}
            </div>
            {showReviewForm && (
                <div className="flex justify-center mx-10">
                    <article className="relative p-6 bg-white rounded-lg w-[95vw] shadow-custom md:w-[20rem]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit A Review</h3>
                        <form className="space-y-6" onSubmit={submitReview}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name(Optional)
                                </label>
                                <input
                                    disabled={isProcessing}
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={"anonymous"}
                                    placeholder={"Anonymous"}
                                    autoComplete="name"
                                    className="w-full p-3 border rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="review"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Review
                                </label>
                                <textarea
                                    disabled={isProcessing}
                                    id="review"
                                    name="review"
                                    rows={4}
                                    className="w-full p-3 border rounded-md shadow-sm"
                                    placeholder="Write your review..."
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="rating"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Rating
                                </label>
                                <ReactStars edit={!isProcessing} onChange={(new_rating) => setRating(new_rating)}
                                            value={rating} count={5}
                                            size={50} color2={'#ffd700'}/>
                            </div>
                            <div>
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                    ref={recaptchaRef}
                                    onChange={(value) => {
                                        setCaptchaValue(value);
                                        setCaptchaError(false); // Clear error on valid input
                                    }}
                                    onExpired={() => {
                                        setCaptchaValue(null);
                                        setCaptchaError(true); // Show error on expiration
                                    }}
                                    className={`${
                                        captchaError ? "border-red-500" : ""
                                    }`}
                                />
                                {captchaError && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Please complete the CAPTCHA.
                                    </p>
                                )}
                            </div>
                            <button
                                disabled={isProcessing}
                                type="submit"
                                className="w-full disabled:cursor-not-allowed disabled:bg-opacity-60 bg-primary-100 text-white py-2 px-4 rounded-md shadow-md hover:bg-primary-200"
                            >
                                Submit
                            </button>
                        </form>
                        <button
                            onClick={handleAddReviewClick}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            <IoClose size={20}/>
                        </button>
                    </article>
                </div>
            )}
        </section>
    );
};

export default Reviews;
