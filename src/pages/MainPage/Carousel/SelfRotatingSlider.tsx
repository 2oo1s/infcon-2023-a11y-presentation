import { Box, Grid } from "@mui/material";
import { carouselItems } from "constant/carousel";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRotatedItems } from "service/carousel.service";
import { CarouselItemCard } from "./CarouselItemCard";
import { NavigationButton } from "./NavigationButton";

export const SelfRotatingSlider = () => {
  const items = carouselItems;
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const sliderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const moveRight = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const moveLeft = useCallback(() => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  }, [items.length]);

  useEffect(() => {
    sliderTimeout.current = setInterval(() => {
      moveRight();
    }, 5000); // 시간 간격 변경 ... 시간이 충분하지 않으면 정신 없어질 수 있음

    return () => {
      if (sliderTimeout.current) clearInterval(sliderTimeout.current);
    };
  }, [activeIndex, moveRight]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      moveRight();
    } else if (event.key === "ArrowLeft") {
      moveLeft();
    }
  };

  const rotatedItems = getRotatedItems(carouselItems, activeIndex);

  return (
    <Box
      // 정적인 요소에 focus
      // tabIndex={0}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      sx={{
        position: "relative",
        width: "100%",
        overflowX: "hidden",
        pb: "120px",
      }}
    >
      {/* 버튼 생성 */}
      <NavigationButton
        direction="left"
        onClick={moveLeft}
        // 요소의 기능이나 목적을 알려주는 tag
        aria-label="이전 슬라이드로 이동"
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 0,
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            justifyContent: "center",
            display: "flex",
            position: "relative",
            height: "fit-content",
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              width: "fit-content",
              marginTop: 0,
            }}
          >
            {rotatedItems.map((item, index) => (
              <CarouselItemCard item={item} index={index} key={item.id} />
            ))}
          </Grid>
        </Box>
      </Box>

      {/* 버튼 생성 */}
      <NavigationButton
        direction="right"
        onClick={moveRight}
        aria-label="다음 슬라이드로 이동"
      />
    </Box>
  );
};
