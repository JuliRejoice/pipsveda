"use client";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
const SecondJson = "/assets/json/3-Get Sertified.json";
export default function SertifiedAnimation() {
    const [animationData, setAnimationData] = useState(null);
    useEffect(() => {
        fetch(SecondJson)
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error("Error loading animation data:", error));
    }, []);
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}
