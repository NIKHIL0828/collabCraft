"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Spinner,
  Center,
  Flex,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { 
  AddIcon, 
  ChevronDownIcon, 
  SettingsIcon 
} from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import DocumentCard from "@/components/DocumentCard";

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Theme Constants
  const mainBg = "gray.50";
  const brandColor = "teal.600";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }

      fetchDocuments();
    };

    setTimeout(checkAuth, 50);
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not load your workspace.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const response = await api.post("/documents", {
        title: "Untitled Draft",
      });

      if (response.data.success) {
        toast({
          title: "Success!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
        router.push(`/editor/${response.data.document._id}`);
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Could not create a new document.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleDeleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
      toast({
        title: "Moved to trash",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" bg={mainBg}>
        <Spinner size="xl" color={brandColor} thickness="2px" speed="0.8s" emptyColor="gray.200" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={mainBg}>
      {/* --- NAVBAR --- */}
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={50}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="saturate(180%) blur(20px)"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
          <Flex h="16" align="center" justify="space-between">
            
            {/* LEFT: Brand */}
            <HStack spacing={3} cursor="pointer">
              {/* Simple Logo Placeholder */}
              <Box boxSize={8} bgGradient="linear(to-br, teal.400, blue.500)" borderRadius="lg" transform="rotate(-10deg)" />
              <Heading
                size="md"
                fontWeight="800"
                letterSpacing="tight"
                color="gray.800"
              >
                CollabCraft
              </Heading>
            </HStack>
            
            {/* RIGHT: Actions */}
            <HStack spacing={{ base: 2, md: 4 }}>
              {/* Mobile "New" Icon Button */}
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                aria-label="New document"
                icon={<AddIcon />}
                size="sm"
                variant="ghost"
                onClick={handleCreateDocument}
              />

              {/* Desktop "New" Button */}
              <Button
                display={{ base: 'none', md: 'flex' }}
                leftIcon={<AddIcon boxSize={3} />}
                colorScheme="teal"
                bg={brandColor}
                size="sm"
                px={4}
                fontSize="sm"
                fontWeight="semibold"
                borderRadius="md"
                _hover={{ bg: "teal.700" }}
                onClick={handleCreateDocument}
              >
                New Document
              </Button>

              {/* User Menu */}
              <Menu autoSelect={false}>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  p={1}
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.200" }}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="xs"
                      name={user?.name}
                      src={user?.avatar}
                      borderWidth={2}
                      borderColor={brandColor}
                    />
                     <Box display={{ base: 'none', lg: 'block' }} textAlign="left" ml={1}>
                      <Text fontSize="xs" fontWeight="bold" color="gray.700" lineHeight="shorter">
                        {user?.name?.split(" ")[0]}
                      </Text>
                    </Box>
                    <ChevronDownIcon color="gray.400" boxSize={4} />
                  </HStack>
                </MenuButton>
                <MenuList 
                  boxShadow="xl" 
                  border="1px solid"
                  borderColor="gray.100"
                  fontSize="sm" 
                  zIndex={101}
                  p={2}
                  rounded="xl"
                >
                  <HStack px={3} py={3} spacing={3}>
                    <Avatar size="sm" name={user?.name} src={user?.avatar} />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">{user?.name}</Text>
                      <Text fontSize="xs" color="gray.500">{user?.email}</Text>
                    </Box>
                  </HStack>
                  <MenuDivider />
                  <MenuItem rounded="md" icon={<SettingsIcon />}>
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    rounded="md"
                    onClick={handleLogout}
                    color="red.500"
                    _hover={{ bg: "red.50" }}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

          </Flex>
        </Container>
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Container maxW="container.xl" py={10} px={{ base: 4, md: 8 }}>
        <VStack align="stretch" spacing={8}>
          {/* Page Header */}
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="lg" color="gray.900" fontWeight="700" letterSpacing="-0.02em">
                Dashboard
              </Heading>
              <Text color="gray.500" mt={1}>
                Welcome back, here are your recent files.
              </Text>
            </Box>
          </Flex>

          {/* Content Grid or Empty State */}
          {documents.length === 0 ? (
            <Center 
              py={24} 
              bg="white" 
              borderRadius="xl" 
              border="1px dashed" 
              borderColor="gray.300"
              flexDir="column"
              boxShadow="sm"
            >
              <VStack spacing={5} maxW="md" textAlign="center" px={6}>
                <Flex
                  align="center"
                  justify="center"
                  boxSize={16}
                  bg="gray.50"
                  borderRadius="full"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <AddIcon boxSize={6} color="gray.400" />
                </Flex>
                <Box>
                  <Heading size="md" mb={2} color="gray.800" fontWeight="semibold">
                    No documents yet
                  </Heading>
                  <Text color="gray.500">
                    Create your first document to get started with CollabCraft.
                  </Text>
                </Box>
                <Button
                  size="md"
                  colorScheme="teal"
                  bg={brandColor}
                  px={8}
                  onClick={handleCreateDocument}
                  _hover={{ bg: "teal.700" }}
                >
                  Create Document
                </Button>
              </VStack>
            </Center>
          ) : (
            <Box>
               <HStack mb={4} justify="space-between">
                <Text 
                  fontSize="xs" 
                  fontWeight="bold" 
                  color="gray.500" 
                  textTransform="uppercase" 
                  letterSpacing="wider"
                >
                  Recent Files
                </Text>
                <Badge colorScheme="gray" borderRadius="full" px={2}>
                  {documents.length}
                </Badge>
               </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    document={doc}
                    onDelete={handleDeleteDocument}
                    onClick={() => router.push(`/editor/${doc._id}`)}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}