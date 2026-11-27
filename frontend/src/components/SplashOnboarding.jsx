import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const IMG = {
  c1: require("../../assets/img1.jpg"),
  c2: require("../../assets/img2.jpg"),
  c3: require("../../assets/img3.jpg"),
  c4: require("../../assets/img4.jpg"),
  c5: require("../../assets/img5.jpg"),
  c6: require("../../assets/img6.jpg"),
  c7: require("../../assets/img7.jpg"),
};

const TOP_CARD = {
  id: "top",
  eyebrow: "BRAND CAMPAIGN",
  title: "Creator Launch",
  source: IMG.c7,
};

const BELOW_CARDS = [
  { id: "c2", eyebrow: "FOOD · MARRAKECH", title: "Table Stories", source: IMG.c2 },
  { id: "c3", eyebrow: "BEAUTY · RABAT", title: "Glow Edit", source: IMG.c3 },
  { id: "c4", eyebrow: "TRAVEL · CHEFCHAOUEN", title: "Atlas Escape", source: IMG.c4 },
  { id: "c5", eyebrow: "TECH · TANGIER", title: "Studio Drop", source: IMG.c5 },
  { id: "c6", eyebrow: "FITNESS · AGADIR", title: "Active Run", source: IMG.c6 },
];

// Side columns exist across the entire grid from the start (slivers at edges -> ~50% visible at final zoom-out)
const SIDE_ROWS = [
  {
    offset: -1,
    left: { id: "sl-1", eyebrow: "STYLE · CASA", title: "Runway", source: IMG.c3 },
    right: { id: "sr-1", eyebrow: "FOOD · RABAT", title: "Bistro", source: IMG.c2 },
  },
  {
    offset: 0,
    left: { id: "sl0", eyebrow: "TRAVEL · ATLAS", title: "Dunes", source: IMG.c4 },
    right: { id: "sr0", eyebrow: "TECH · TANGIER", title: "Unboxing", source: IMG.c5 },
  },
  {
    offset: 1,
    left: { id: "sl1", eyebrow: "FITNESS · AGADIR", title: "Surf Club", source: IMG.c6 },
    right: { id: "sr1", eyebrow: "BRAND · CASA", title: "Deal Day", source: IMG.c7 },
  },
  {
    offset: 2,
    left: { id: "sl2", eyebrow: "FASHION · CASA", title: "Lookbook", source: IMG.c1 },
    right: { id: "sr2", eyebrow: "BEAUTY · RABAT", title: "Skincare", source: IMG.c3 },
  },
  {
    offset: 3,
    left: { id: "sl3", eyebrow: "TRAVEL · ATLAS", title: "Roadtrip", source: IMG.c4 },
    right: { id: "sr3", eyebrow: "FOOD · FES", title: "Taste Lab", source: IMG.c2 },
  },
  {
    offset: 4,
    left: { id: "sl4", eyebrow: "TECH · TANGIER", title: "Gear Box", source: IMG.c5 },
    right: { id: "sr4", eyebrow: "BRAND · CASA", title: "Launch Day", source: IMG.c7 },
  },
  {
    offset: 5,
    left: { id: "sl5", eyebrow: "CREATOR · RABAT", title: "Collabs", source: IMG.c3 },
    right: { id: "sr5", eyebrow: "TRAVEL · MARRAKECH", title: "Retreat", source: IMG.c4 },
  },
];

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const FONT_TITLE = "PlusJakartaSans_800ExtraBold";
const FONT_EYEBROW = "Inter_500Medium";
const FONT_BODY = "Inter_400Regular";

const TEXT_TRAVEL = 90;
const TEXT_BOTTOM_RATIO = 0.11;
const CARD_GAP = 16;
const CARD_MORPH_DELAY = 1800;
const SCROLL_DELAY = 2700;
const SCROLL_DURATION = 3000;
const ZOOM_OUT_2_DELAY = 5800;
const BRAND_DELAY = 6900;
const FINAL_SCALE = 0.8;

function CollabCard({ item, style }) {
  return (
    <Animated.View style={[styles.cardShadow, style]}>
      <View style={[styles.cardInner, styles.rounded24]}>
        <Image
          source={item.source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.82)"]}
          locations={[0, 0.5, 1]}
          style={styles.gradientWrap}
        />
        <View style={[styles.textWrap, styles.cardTextBottom]}>
          <Text style={styles.eyebrow} numberOfLines={1}>
            {item.eyebrow}
          </Text>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function SplashOnboarding({
  active = true,
  source = IMG.c1,
  eyebrow = "Creator x Brands",
  title = "Let's Collab",
}) {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();

  
  const cardW = Math.round(width * 0.64);
  const cardH = Math.round(width * 0.7);
  const colGap = Math.round(width * 0.15);
  const stepY = cardH + CARD_GAP;
  const stepX = cardW + colGap;
  const targetLeft = Math.round((width - cardW) / 2);
  const targetTop = Math.round((height - cardH) / 2);
  const scrollTarget = -BELOW_CARDS.length * stepY;
  const finalWorldY = -Math.round(height * 0.13);
  const maxSideGapExtra = Math.round(width * 0.07);
  const initialSideStaggerY = -Math.round(cardH * 0.15);
  const finalSideStaggerY = -Math.round(cardH * 0.36);

  const imageOpacity = useSharedValue(reduced ? 1 : 0);
  const imageScale = useSharedValue(reduced ? 1 : 1.08);
  const textOpacity = useSharedValue(reduced ? 1 : 0);
  const textY = useSharedValue(reduced ? 0 : TEXT_TRAVEL);
  const textBottom = useSharedValue(
    reduced ? 22 : Math.round(height * TEXT_BOTTOM_RATIO),
  );

  const cardLeft = useSharedValue(reduced ? targetLeft : 0);
  const cardTop = useSharedValue(reduced ? targetTop : 0);
  const cardWidth = useSharedValue(reduced ? cardW : width);
  const cardHeight = useSharedValue(reduced ? cardH : height);
  const cardRadius = useSharedValue(reduced ? 24 : 0);

  const neighborsOpacity = useSharedValue(reduced ? 1 : 0);
  const scrollY = useSharedValue(reduced ? scrollTarget : 0);
  const worldScale = useSharedValue(reduced ? FINAL_SCALE : 1);
  const worldY = useSharedValue(reduced ? finalWorldY : 0);
  const sideGapExtra = useSharedValue(reduced ? maxSideGapExtra : 0);
  const sideStaggerY = useSharedValue(
    reduced ? finalSideStaggerY : initialSideStaggerY,
  );
  const brandOpacity = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      imageOpacity.value = 1;
      imageScale.value = 1;
      textOpacity.value = 1;
      textY.value = 0;
      textBottom.value = 22;
      cardLeft.value = targetLeft;
      cardTop.value = targetTop;
      cardWidth.value = cardW;
      cardHeight.value = cardH;
      cardRadius.value = 24;
      neighborsOpacity.value = 1;
      scrollY.value = scrollTarget;
      worldScale.value = FINAL_SCALE;
      worldY.value = finalWorldY;
      sideGapExtra.value = maxSideGapExtra;
      sideStaggerY.value = finalSideStaggerY;
      brandOpacity.value = 1;
      return;
    }

    // 1. Hero photo fade-in + subtle zoom-out (1.08 -> 1)
    imageOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
    imageScale.value = withTiming(1, { duration: 1400, easing: EASE_OUT });

    // 2. Hero text rises from bottom, then softens briefly during card morph
    textOpacity.value = withSequence(
      withDelay(200, withTiming(1, { duration: 600, easing: EASE_OUT })),
      withDelay(
        CARD_MORPH_DELAY - 800,
        withTiming(0.25, { duration: 350, easing: EASE_OUT }),
      ),
      withDelay(100, withTiming(1, { duration: 350, easing: EASE_OUT })),
    );
    textY.value = withDelay(
      200,
      withTiming(0, { duration: 1000, easing: EASE_OUT }),
    );
    textBottom.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(22, { duration: 800, easing: EASE_OUT }),
    );

    // 3. Full-screen hero morphs into rounded card + reveals center & side columns together
    cardLeft.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(targetLeft, { duration: 800, easing: EASE_OUT }),
    );
    cardTop.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(targetTop, { duration: 800, easing: EASE_OUT }),
    );
    cardWidth.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(cardW, { duration: 800, easing: EASE_OUT }),
    );
    cardHeight.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(cardH, { duration: 800, easing: EASE_OUT }),
    );
    cardRadius.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(24, { duration: 800, easing: EASE_OUT }),
    );
    neighborsOpacity.value = withDelay(
      CARD_MORPH_DELAY + 150,
      withTiming(1, { duration: 600, easing: EASE_OUT }),
    );

    // 4. Vertical grid scrolls upward (side slivers already present at edges)
    scrollY.value = withDelay(
      SCROLL_DELAY,
      withTiming(scrollTarget, {
        duration: SCROLL_DURATION,
        easing: Easing.linear,
      }),
    );

    // 5. Zoom-out 2: grid shrinks toward top; side columns widen & rise higher than center
    worldScale.value = withDelay(
      ZOOM_OUT_2_DELAY,
      withTiming(FINAL_SCALE, { duration: 1400, easing: EASE_OUT }),
    );
    worldY.value = withDelay(
      ZOOM_OUT_2_DELAY,
      withTiming(finalWorldY, { duration: 1400, easing: EASE_OUT }),
    );
    sideGapExtra.value = withDelay(
      SCROLL_DELAY,
      withTiming(maxSideGapExtra, {
        duration: ZOOM_OUT_2_DELAY + 1400 - SCROLL_DELAY,
        easing: EASE_OUT,
      }),
    );
    sideStaggerY.value = withDelay(
      ZOOM_OUT_2_DELAY,
      withTiming(finalSideStaggerY, { duration: 1400, easing: EASE_OUT }),
    );

    // 6. Final COLLAPUB wordmark + tagline fade in below
    brandOpacity.value = withDelay(
      BRAND_DELAY,
      withTiming(1, { duration: 750, easing: EASE_OUT }),
    );
  }, [active]);

  const worldStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: worldY.value }, { scale: worldScale.value }],
  }));

  const columnStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  const neighborsStyle = useAnimatedStyle(() => ({
    opacity: neighborsOpacity.value,
  }));

  const leftSideStyle = useAnimatedStyle(() => ({
    opacity: neighborsOpacity.value,
    transform: [
      { translateX: sideGapExtra.value },
      { translateY: sideStaggerY.value },
    ],
  }));

  const rightSideStyle = useAnimatedStyle(() => ({
    opacity: neighborsOpacity.value,
    transform: [
      { translateX: -sideGapExtra.value },
      { translateY: sideStaggerY.value },
    ],
  }));

  const cardWrapStyle = useAnimatedStyle(() => ({
    left: cardLeft.value,
    top: cardTop.value,
    width: cardWidth.value,
    height: cardHeight.value,
    borderRadius: cardRadius.value,
  }));

  const cardInnerStyle = useAnimatedStyle(() => ({
    borderRadius: cardRadius.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    bottom: textBottom.value,
    transform: [{ translateY: textY.value }],
  }));

  const brandStyle = useAnimatedStyle(() => ({
    opacity: brandOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { transformOrigin: "top" },
          worldStyle,
        ]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, columnStyle]}>
          {/* Card above hero */}
          <CollabCard
            item={TOP_CARD}
            style={[
              {
                left: targetLeft,
                top: targetTop - stepY,
                width: cardW,
                height: cardH,
                borderRadius: 24,
              },
              neighborsStyle,
            ]}
          />

          {/* Center column cards below hero */}
          {BELOW_CARDS.map((item, index) => (
            <CollabCard
              key={item.id}
              item={item}
              style={[
                {
                  left: targetLeft,
                  top: targetTop + (index + 1) * stepY,
                  width: cardW,
                  height: cardH,
                  borderRadius: 24,
                },
                neighborsStyle,
              ]}
            />
          ))}

          {/* Left & right side columns present from the start */}
          {SIDE_ROWS.map((row) => {
            const topPos = targetTop + row.offset * stepY;
            return (
              <View key={`row-${row.offset}`}>
                <CollabCard
                  item={row.left}
                  style={[
                    {
                      left: targetLeft - stepX,
                      top: topPos,
                      width: cardW,
                      height: cardH,
                      borderRadius: 24,
                    },
                    leftSideStyle,
                  ]}
                />
                <CollabCard
                  item={row.right}
                  style={[
                    {
                      left: targetLeft + stepX,
                      top: topPos,
                      width: cardW,
                      height: cardH,
                      borderRadius: 24,
                    },
                    rightSideStyle,
                  ]}
                />
              </View>
            );
          })}

          {/* Hero card (starts full-screen, morphs into center card) */}
          <Animated.View style={[styles.cardShadow, cardWrapStyle]}>
            <Animated.View style={[styles.cardInner, cardInnerStyle]}>
              <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
                <Image
                  source={source}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[styles.gradientWrap, gradientStyle]}
              >
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.35)",
                    "rgba(0,0,0,0.8)",
                  ]}
                  locations={[0, 0.5, 1]}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[styles.textWrap, textStyle]}
                accessible
                accessibilityLabel={`${eyebrow}. ${title}`}
              >
                <Animated.Text style={styles.eyebrow}>{eyebrow}</Animated.Text>
                <Animated.Text style={styles.title}>{title}</Animated.Text>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* Final clean white screen wordmark + tagline */}
      <Animated.View
        pointerEvents="none"
        style={[styles.brandArea, { top: height * 0.52 }, brandStyle]}
      >
        <Text style={styles.brandName}>C O L L A P U B</Text>
        <Text style={styles.brandTagline}>
          Find the right creators for your brand.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  rounded24: {
    borderRadius: 24,
  },
  cardShadow: {
    position: "absolute",
    shadowColor: "#0F1419",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  gradientWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  textWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "center",
  },
  cardTextBottom: {
    bottom: 22,
  },
  eyebrow: {
    fontFamily: FONT_EYEBROW,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: -1.2,
    color: "#FFFFFF",
    textAlign: "center",
  },
  cardTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.9,
    color: "#FFFFFF",
    textAlign: "center",
  },
  brandArea: {
    position: "absolute",
    left: 32,
    right: 32,
    alignItems: "center",
    gap: 12,
  },
  brandName: {
    fontFamily: FONT_TITLE,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 5,
    color: "#0F1419",
    textAlign: "center",
  },
  brandTagline: {
    fontFamily: FONT_BODY,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 260,
  },
});
