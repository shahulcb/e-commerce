import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productsApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";
import { useDispatch } from "react-redux";
import { setCartItems } from "../../redux/features/cartSlice";
import MetaData from "../layout/MetaData";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  );
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]); // eslint-disable-line react-hooks/exhaustive-deps
  const [activeImage, setActiveImage] = useState("");
  useEffect(() => {
    setActiveImage(
      data?.product?.images[0]
        ? data?.product?.images[0].url
        : "/images/default_product.png"
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const decreseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  const increseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= data?.product?.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const setItemToCart = () => {
    const cartItem = {
      product: data?.product?._id,
      name: data?.product?.name,
      price: data?.product?.price,
      image: data?.product?.images[0]?.url,
      stock: data?.product?.stock,
      quantity,
    };
    dispatch(setCartItems(cartItem));
    toast.success("Item added to cart");
  };
  if (isLoading) return <Loader />;
  return (
    <>
      <MetaData title={data?.product?.name} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            <img
              className="d-block w-100"
              src={activeImage}
              alt={data?.product?.name}
              width="340"
              height="390"
            />
          </div>
          <div className="row justify-content-start mt-5">
            {data?.product?.images?.map((img) => (
              <div className="col-2 ms-4 mt-2">
                <a href={() => false} role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${
                      img?.url === activeImage ? "border-warning" : ""
                    }`}
                    height="100"
                    width="100"
                    src={img?.url}
                    alt={img?.url}
                    onClick={() => setActiveImage(img?.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-lg-5 mt-5">
          <h3>{data?.product?.name}</h3>
          <p id="product_id">Product # {data?.product?._id}</p>
          <hr />
          <div className="d-flex">
            <div className="star-ratings">
              <StarRatings
                rating={data?.product?.ratings}
                starRatedColor="#ffb829"
                numberOfStars={5}
                name="rating"
                starDimension="22px"
                starSpacing="1px"
              />
            </div>
            <span id="no-of-reviews" className="pt-1 ps-2">
              ({data?.product?.numOfReviews} Reviews)
            </span>
          </div>
          <hr />
          <p id="product_price">${data?.product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" onClick={decreseQty}>
              -
            </span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
              readonly
            />
            <span className="btn btn-primary plus" onClick={increseQty}>
              +
            </span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={data?.product?.stock <= 0}
            onClick={setItemToCart}
          >
            Add to Cart
          </button>
          <hr />
          <p>
            Status:{" "}
            <span
              id="stock_status"
              className={data?.product?.stock > 0 ? "greenColor" : "redColor"}
            >
              {data?.product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
          <hr />
          <h4 className="mt-2">Description:</h4>
          <p>{data?.product?.description}</p>
          <hr />
          <p id="product_seller mb-3">
            Sold by: <strong>{data?.product?.seller}</strong>
          </p>
          <div className="alert alert-danger my-5" type="alert">
            Login to post your review.
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
