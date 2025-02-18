import {
  Box,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import Visibility from "components/[guild]/Visibility"
import React, { PropsWithChildren } from "react"
import { Visibility as VisibilityType } from "types"
import { useRequirementContext } from "./RequirementContext"
import { RequirementImage, RequirementImageCircle } from "./RequirementImage"
import ResetRequirementButton from "./ResetRequirementButton"
import ViewOriginalPopover from "./ViewOriginalPopover"

export type RequirementProps = PropsWithChildren<{
  fieldRoot?: string
  isImageLoading?: boolean
  image?: string | JSX.Element
  footer?: JSX.Element
  rightElement?: JSX.Element
  imageWrapper?: React.FC<any>
  childrenWrapper?: React.FC<any>
  showViewOriginal?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  rightElement,
  children,
  fieldRoot,
  imageWrapper,
  childrenWrapper,
  showViewOriginal,
}: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const ChildrenWrapper = childrenWrapper ?? Box
  const ImageWrapper = imageWrapper ?? React.Fragment
  const wrapperProps =
    !!childrenWrapper && !!imageWrapper ? { baseFieldPath: fieldRoot } : {}

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Box mt="3px" alignSelf={"start"}>
        <RequirementImageCircle isImageLoading={isImageLoading}>
          <ImageWrapper {...wrapperProps}>
            <RequirementImage image={requirement?.data?.customImage || image} />
          </ImageWrapper>
        </RequirementImageCircle>
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
        <ChildrenWrapper {...wrapperProps} display="inline-block">
          {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
          {requirement?.type === "LINK_VISIT"
            ? children
            : requirement?.data?.customName || children}
          {!fieldRoot ? (
            <Visibility
              visibilityRoleId={requirement?.visibilityRoleId}
              entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
              ml="1"
            />
          ) : !childrenWrapper ? (
            <SetVisibility entityType="requirement" fieldBase={fieldRoot} />
          ) : null}
        </ChildrenWrapper>

        <HStack wrap={"wrap"}>
          {showViewOriginal && (
            <ViewOriginalPopover>
              <HStack p={3} gap={4}>
                <RequirementImageCircle isImageLoading={isImageLoading}>
                  <RequirementImage image={image} />
                </RequirementImageCircle>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  alignItems={{ base: "flex-start", md: "center" }}
                  spacing={{ base: 2, md: 5 }}
                >
                  <Text wordBreak="break-word" flexGrow={1}>
                    {children}
                  </Text>
                  {!!fieldRoot && <ResetRequirementButton />}
                </Stack>
              </HStack>
            </ViewOriginalPopover>
          )}
          {footer}
        </HStack>
      </VStack>
      {rightElement}
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
