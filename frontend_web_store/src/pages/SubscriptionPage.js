import axios from "axios";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import NavbarComponent from "../components/NavbarComponent";
import { API } from "../env/Constants";

export default function SubscriptionPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetSubscriptionsToast, setShowGetSubscriptionsToast] =
    useState(false);
  const [errorGetSubscriptions, setErrorGetSubscriptions] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
      }
      setCartOrderDetailCount(Number(counter));
    }
  });

  const getSubscriptions = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.get(`${API}/subscription`, {
        params: { page: page, size: size },
      });
      setSubscriptions(data.content);
      setTotalPages(data.totalPages);
      setErrorGetSubscriptions({});
      setShowGetSubscriptionsToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetSubscriptions(errorObject);
        setShowGetSubscriptionsToast(true);
      }
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, [page]);
  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <div>Subscription List</div>
      </>
    </>
  );
}
