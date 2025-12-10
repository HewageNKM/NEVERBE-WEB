import React from "react";
import Link from "next/link";

const SEOContent = () => {
  return (
    <section className="w-full bg-white border-t border-gray-100 py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-primary hover:prose-a:text-gray-900">
          {/* PRIMARY H2: Targeting the Broad "Shoes" Keyword */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Ultimate Destination to Buy Shoes in Sri Lanka
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 mb-4">
                Welcome to NEVERBE, the largest online platform to{" "}
                <strong>buy shoes in Sri Lanka</strong>. Whether you are looking
                for high-performance sports gear, stylish casual wear, or
                budget-friendly footwear, we have it all. We understand that
                finding the perfect pair of
                <strong>shoes</strong> can be difficult, which is why we have
                curated a massive collection that caters to every need, style,
                and budget.
              </p>
              <p className="text-gray-600 mb-4">
                From Colombo to Kandy, we are known for delivering premium
                quality <strong>footwear</strong>
                right to your doorstep. Stop searching for "shoe shops near me"
                and explore our comprehensive online catalog.
              </p>

              {/* SECONDARY KEYWORDS: Targeting Specific Types (Men/Women/Running) */}
              <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-3">
                Shoes for Every Occasion
              </h3>
              <ul className="list-none space-y-2 pl-0 text-gray-600">
                <li>
                  <strong>Running & Sports Shoes:</strong> Crush your fitness
                  goals with our range of athletic footwear designed for comfort
                  and durability. Perfect for the gym, track, or street.
                </li>
                <li>
                  <strong>Casual Sneakers:</strong> Upgrade your street style
                  with our vast collection of trendy sneakers. From high-tops to
                  low-tops, we have the latest designs.
                </li>
                <li>
                  <strong>Slides & Sandals:</strong> For those relaxed days,
                  check out our comfortable slippers and slides, perfect for the
                  Sri Lankan climate.
                </li>
                <li>
                  <strong>Boots & High-Ankle Shoes:</strong> Make a statement
                  with our rugged and stylish boots collection.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Why We Are the #1 Shoe Store in Sri Lanka
              </h3>
              <p className="text-gray-600 mb-4">
                Buying <strong>shoes online</strong> requires trust. At NEVERBE,
                we offer:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
                <li>
                  <strong>Island-wide Delivery:</strong> We deliver shoes to
                  every corner of Sri Lanka.
                </li>
                <li>
                  <strong>Cash on Delivery (COD):</strong> Pay only when you
                  have the shoes in your hands.
                </li>
                <li>
                  <strong>Premium Quality:</strong> We specialize in Master Copy
                  and 7A quality shoes that look and feel like the originals
                  (Nike, Adidas, Jordan) at a fraction of the price.
                </li>
                <li>
                  <strong>Easy Returns:</strong> Size didn't fit? No problem. We
                  offer easy exchanges.
                </li>
              </ul>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">
                  Popular Searches
                </h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  {/* Internal Linking Strategy: This helps Google index your site structure */}
                  <Link
                    href="/collections/categories/Running%20Shoes"
                    className="text-blue-600 hover:underline"
                  >
                    Running Shoes
                  </Link>{" "}
                  •
                  <Link
                    href="/collections/categories/Sandals%20&%20Slippers%20&%20Slides"
                    className="text-blue-600 hover:underline"
                  >
                    {" "}
                    Slides
                  </Link>{" "}
                  •
                  <Link
                    href="/collections/categories/Boots"
                    className="text-blue-600 hover:underline"
                  >
                    {" "}
                    Boots
                  </Link>{" "}
                  •
                  <Link href="/" className="text-blue-600 hover:underline">
                    {" "}
                    Men's Sneakers
                  </Link>{" "}
                  •
                  <Link href="/" className="text-blue-600 hover:underline">
                    {" "}
                    Gym Shoes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SEOContent;
