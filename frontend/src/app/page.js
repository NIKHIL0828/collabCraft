"use client";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiEdit3, FiUsers, FiZap, FiLock } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomePage() {
  const router = useRouter();
  const bgGradient = "linear(to-br, purple.50, blue.50)";
  const cardBg = useColorModeValue("white", "gray.800");
  const dotColor = useColorModeValue("purple.500", "purple.300");

  const features = [
    {
      icon: FiEdit3,
      title: "Smart Text Editor",
      description:
        "Craft beautiful, well-formatted documents effortlessly with our intuitive rich text tools.",
    },
    {
      icon: FiUsers,
      title: "Real-Time Teamwork",
      description:
        "Collaborate with your teammates instantly — every change appears in real-time.",
    },
    {
      icon: FiZap,
      title: "AI Writing Assistant",
      description:
        "Boost your productivity with intelligent AI suggestions, rephrasing, and grammar help.",
    },
    {
      icon: FiLock,
      title: "End-to-End Security",
      description:
        "Your documents are protected with advanced encryption and private access controls.",
    },
  ];

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient} overflowX="hidden">
      {/* Hero Section */}
      <Container maxW="container.xl" pt={20} pb={16}>
        <VStack spacing={8} textAlign="center">
          <Heading
            fontSize={{ base: "4xl", md: "6xl" }}
            bgGradient="linear(to-r, purple.600, blue.600)"
            bgClip="text"
            fontWeight="extrabold"
          >
            CollabCraft
          </Heading>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            color="gray.600"
            maxW="2xl"
          >
            Collaborate. Create. Craft smarter.  
            An AI-powered document editor built for seamless teamwork and powerful writing.
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="purple"
              onClick={() => router.push("/auth/register")}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "xl",
              }}
              transition="all 0.2s"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="purple"
              onClick={() => router.push("/auth/login")}
            >
              Log In
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <Heading size="xl" textAlign="center">
            Powerful features built for modern creators
          </Heading>

          <Box
            w="full"
            px={{ base: 4, md: 12 }}
            sx={{
              ".slick-dots": {
                bottom: "-40px",
              },
              ".slick-dots li button:before": {
                fontSize: "12px",
                color: dotColor,
                opacity: 0.25,
                transition: "opacity 0.3s",
              },
              ".slick-dots li.slick-active button:before": {
                color: dotColor,
                opacity: 1,
              },
              ".slick-track": {
                display: "flex !important",
              },
              ".slick-slide": {
                height: "inherit !important",
                display: "flex !important",
              },
              ".slick-slide > div": {
                height: "100%",
                width: "100%",
                display: "flex",
              },
            }}
          >
            <Slider {...sliderSettings}>
              {features.map((feature, index) => (
                <Box key={index} px={4} py={4} h="full" flex={1}>
                  <Box
                    bg={cardBg}
                    p={{ base: 8, md: 10 }}
                    borderRadius="2xl"
                    boxShadow="lg"
                    h="full"
                    minH={{ base: "300px", md: "350px" }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "xl",
                    }}
                    transition="all 0.3s"
                  >
                    <VStack spacing={5} align="start">
                      <Icon
                        as={feature.icon}
                        w={12}
                        h={12}
                        color="purple.500"
                      />
                      <Heading size="lg">{feature.title}</Heading>
                      <Text fontSize="lg" color="gray.600">
                        {feature.description}
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Container maxW="container.xl" py={20}>
        <Box bg="purple.600" borderRadius="2xl" p={12} textAlign="center">
          <VStack spacing={6}>
            <Heading size="xl" color="white">
              Ready to craft your next great document?
            </Heading>
            <Text fontSize="lg" color="purple.100" maxW="2xl">
              Join creators and teams using <b>CollabCraft</b> to write, collaborate, and innovate — all in one place.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="purple.600"
              onClick={() => router.push("/auth/register")}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "2xl",
              }}
            >
              Start Writing Now
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
