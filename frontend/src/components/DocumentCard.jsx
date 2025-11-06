"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  useToast,
  useDisclosure,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiTrash2,
  FiShare2,
  FiFileText,
  FiCopy,
  FiMail,
  FiLink,
  FiEye,
  FiEdit,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import api from "@/services/api";

const DocumentCard = ({ document, onDelete, onClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareEmail, setShareEmail] = useState("");
  const [emailPermission, setEmailPermission] = useState("viewer");
  const [linkPermission, setLinkPermission] = useState("viewer");
  const [shareLink, setShareLink] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const toast = useToast();

  const formatDate = (date) => {
    try {
      const d = new Date(date);
      const now = new Date();
      const diffInSeconds = Math.floor((now - d) / 1000);

      if (diffInSeconds < 60) {
        return "Just now";
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      }

      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "Recently";
    }
  };

  const getPreview = () => {
    const text = document.content?.replace(/<[^>]*>/g, "") || "";
    return text.substring(0, 120) + (text.length > 120 ? "..." : "");
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareLink("");
    setShareEmail("");
    onOpen();
  };

  const handleGenerateShareLink = async () => {
    setLoadingLink(true);
    try {
      const response = await api.post(`/documents/${document._id}/share-link`, {
        permission: linkPermission,
      });
      if (response.data.success) {
        setShareLink(response.data.shareLink);
        toast({
          title: "Share link generated",
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoadingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      status: "success",
      duration: 2000,
    });
  };

  const handleSendEmailInvitation = async () => {
    // ... (keep existing validation logic)
    if (!shareEmail) {
      toast({
        title: "Email required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareEmail)) {
      toast({
        title: "Invalid email",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoadingEmail(true);
    try {
      const response = await api.post(
        `/documents/${document._id}/send-invitation`,
        {
          email: shareEmail,
          permission: emailPermission,
        }
      );

      if (response.data.success) {
        toast({
          title: "Invitation sent",
          description: response.data.message,
          status: "success",
          duration: 4000,
        });
        setShareEmail("");
        if (response.data.shareLink) {
          setShareLink(response.data.shareLink);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send invitation",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
        cursor="pointer"
        onClick={onClick}
        transition="all 0.2s ease-in-out"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "md",
          borderColor: "teal.300",
        }}
        h="200px"
        display="flex"
        flexDirection="column"
      >
        {/* Card Header */}
        <HStack
          p={4}
          pb={2}
          justify="space-between"
          align="flex-start"
          borderBottom="1px solid"
          borderColor="gray.50"
        >
          <HStack spacing={3} flex={1} overflow="hidden">
            <Box
              p={2}
              bg="teal.50"
              color="teal.500"
              borderRadius="lg"
              flexShrink={0}
            >
              <Icon as={FiFileText} boxSize={5} />
            </Box>
            <VStack align="start" spacing={0} overflow="hidden" flex={1}>
              <Heading
                size="sm"
                fontWeight="semibold"
                color="gray.800"
                noOfLines={1}
                w="full"
                title={document.title}
              >
                {document.title || "Untitled Document"}
              </Heading>
              <HStack spacing={1} color="gray.400" fontSize="xs">
                <Icon as={FiClock} />
                <Text>{formatDate(document.updatedAt)}</Text>
              </HStack>
            </VStack>
          </HStack>

          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
              color="gray.400"
              _hover={{ color: "gray.700", bg: "gray.100" }}
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList fontSize="sm" boxShadow="lg" borderColor="gray.100">
              <MenuItem icon={<FiShare2 />} onClick={handleShareClick}>
                Share
              </MenuItem>
              <MenuItem
                icon={<FiTrash2 />}
                color="red.500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(document._id);
                }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {/* Card Body (Preview) */}
        <Box px={4} py={3} flex={1} overflow="hidden">
          <Text
            fontSize="sm"
            color="gray.500"
            noOfLines={4}
            lineHeight="tall"
          >
            {getPreview() || (
              <Text as="span" fontStyle="italic" color="gray.400">
                No content yet...
              </Text>
            )}
          </Text>
        </Box>

        {/* Card Footer */}
        {document.collaborators?.length > 0 && (
          <HStack
            px={4}
            py={2}
            bg="gray.50"
            borderTop="1px solid"
            borderColor="gray.100"
            spacing={2}
          >
            <Icon as={FiUsers} color="teal.500" boxSize={3.5} />
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Shared with {document.collaborators.length} others
            </Text>
          </HStack>
        )}
      </Box>

      {/* Share Modal - Refined UI */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl" boxShadow="xl">
          <ModalHeader
            borderBottom="1px solid"
            borderColor="gray.100"
            py={4}
          >
            <HStack spacing={3}>
              <Box
                p={2}
                bg="teal.50"
                color="teal.600"
                borderRadius="full"
              >
                <Icon as={FiShare2} boxSize={5} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Share Document
                </Text>
                <Text fontSize="xs" color="gray.500" fontWeight="normal">
                  {document.title || "Untitled"}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton mt={3} />
          <ModalBody p={0}>
            <Tabs colorScheme="teal" isFitted variant="enclosed-colored">
              <TabList borderBottom="1px solid" borderColor="gray.100">
                <Tab
                  py={4}
                  fontWeight="medium"
                  _selected={{
                    color: "teal.600",
                    bg: "white",
                    borderTop: "2px solid",
                    borderColor: "teal.500",
                    borderBottomColor: "transparent",
                  }}
                >
                  <HStack>
                    <FiMail />
                    <Text>Email Invite</Text>
                  </HStack>
                </Tab>
                <Tab
                  py={4}
                  fontWeight="medium"
                  _selected={{
                    color: "teal.600",
                    bg: "white",
                    borderTop: "2px solid",
                    borderColor: "teal.500",
                    borderBottomColor: "transparent",
                  }}
                >
                  <HStack>
                    <FiLink />
                    <Text>Share Link</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Email Tab */}
                <TabPanel p={6}>
                  <VStack spacing={5} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Email Address
                      </FormLabel>
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        borderRadius="md"
                        focusBorderColor="teal.400"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Permission
                      </FormLabel>
                      <RadioGroup
                        value={emailPermission}
                        onChange={setEmailPermission}
                      >
                        <HStack spacing={6}>
                          <Radio value="viewer" colorScheme="teal">
                            <Text fontSize="sm">View Only</Text>
                          </Radio>
                          <Radio value="editor" colorScheme="teal">
                            <Text fontSize="sm">Can Edit</Text>
                          </Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>

                    <Button
                      colorScheme="teal"
                      onClick={handleSendEmailInvitation}
                      isLoading={loadingEmail}
                      w="full"
                      size="md"
                    >
                      Send Invitation
                    </Button>

                    {shareLink && (
                      <Box
                        p={3}
                        bg="green.50"
                        borderRadius="md"
                        border="1px dashed"
                        borderColor="green.300"
                      >
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="xs" fontWeight="bold" color="green.700" textTransform="uppercase">
                            Backup Link
                          </Text>
                          <Button
                            size="xs"
                            leftIcon={<FiCopy />}
                            variant="ghost"
                            colorScheme="green"
                            onClick={handleCopyLink}
                          >
                            Copy
                          </Button>
                        </HStack>
                        <Text fontSize="xs" color="green.800" noOfLines={1} fontFamily="mono">
                          {shareLink}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* Link Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    {!shareLink ? (
                      <>
                        <VStack
                          p={6}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px dashed"
                          borderColor="gray.300"
                          spacing={4}
                        >
                           <Icon as={FiLink} boxSize={8} color="gray.400" />
                           <Text fontSize="sm" color="gray.600" textAlign="center">
                             Generate a unique link to share this document with anyone.
                           </Text>
                          <RadioGroup
                            value={linkPermission}
                            onChange={setLinkPermission}
                            colorScheme="teal"
                          >
                            <HStack spacing={4}>
                              <Radio value="viewer">Viewer</Radio>
                              <Radio value="editor">Editor</Radio>
                            </HStack>
                          </RadioGroup>
                          <Button
                            colorScheme="teal"
                            onClick={handleGenerateShareLink}
                            isLoading={loadingLink}
                            size="sm"
                          >
                            Generate Link
                          </Button>
                        </VStack>
                      </>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        <Box>
                           <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                             Shareable Link ({linkPermission})
                           </Text>
                          <InputGroup size="md">
                            <Input
                              value={shareLink}
                              isReadOnly
                              pr="4.5rem"
                              bg="gray.50"
                              focusBorderColor="teal.400"
                            />
                            <InputRightElement width="4.5rem">
                              <Button h="1.75rem" size="sm" onClick={handleCopyLink}>
                                Copy
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </Box>
                        <Button
                          variant="outline"
                          colorScheme="gray"
                          size="sm"
                          onClick={() => setShareLink("")}
                        >
                          Create Different Link
                        </Button>
                      </VStack>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DocumentCard;