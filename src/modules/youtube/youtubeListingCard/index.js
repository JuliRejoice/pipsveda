"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./youtube.module.scss";
import Pagination from "@/compoents/pagination";
import EmptyState from "@/modules/(admin)/chapter/recentCourse/EmptyState";
import Button from "@/compoents/button";
import { getYoutubeVideo } from "@/compoents/api/dashboard";

const CardImage = "/assets/images/dummy-img.png";
const YTplay = "/assets/icons/youtube.png";

const VideoSkeleton = ({ count = 6 }) => {
  return (
    <div className={styles.skeletonGrid}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default function YoutubeListingCard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = videos.length;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await getYoutubeVideo();
        setVideos(data?.payload?.data || []);
      } catch (err) {
        console.log("Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedVideos = videos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={styles.videoListingCard}>
        <div className="container">
          <VideoSkeleton count={itemsPerPage} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoListingCard}>
      <div className="container">
        {videos.length === 0 ? (
          <EmptyState
            title="No Videos Found"
            description="There are no YouTube videos available at the moment."
          />
        ) : (
          <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selectedVideos.map((video, index) => (
              <motion.div
                key={index}
                className={styles.griditems}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => window.open(video.videoUrl, "_blank")}
              >
                <div className={styles.image}>
                  <img
                    src={video.thumbnail || CardImage}
                    alt="YT Thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CardImage;
                    }}
                  />
                  <div className={styles.playButton}>
                    <img src={YTplay} alt="Play" />
                  </div>
                </div>
                <div className={styles.details}>
                  <h3>{video?.description || "No title available"}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && totalItems > itemsPerPage && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
