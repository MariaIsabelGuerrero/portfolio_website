'use client';

import React, { useState } from "react"
import { Modal, IconButton, Box, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import { useLanguage } from "@/lib/i18n"

const Certificate = ({ certificateImage, fileType }: { certificateImage: string; fileType?: string }) => {
	const { t } = useLanguage()
	const [open, setOpen] = useState(false)

	const isPdf = fileType === "pdf" || certificateImage?.toLowerCase().endsWith(".pdf")

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Thumbnail Container */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 2,
					boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					cursor: "pointer",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
						"& .overlay": {
							opacity: 1,
						},
						"& .hover-content": {
							transform: "translate(-50%, -50%)",
							opacity: 1,
						},
						"& .certificate-image": {
							filter: "contrast(1.05) brightness(1) saturate(1.1)",
						},
					},
				}}
				onClick={handleOpen}
			>
				{/* Certificate Thumbnail */}
				<Box
					sx={{
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							zIndex: 1,
						},
					}}>
					{isPdf ? (
						<Box
							sx={{
								width: "100%",
								aspectRatio: "4/3",
								overflow: "hidden",
								position: "relative",
							}}
						>
							<iframe
								src={`${certificateImage}#toolbar=0&navpanes=0&scrollbar=0`}
								title={t("Certificate", "Certificat")}
								style={{
									width: "100%",
									height: "100%",
									border: "none",
									pointerEvents: "none",
								}}
							/>
						</Box>
					) : (
						<img
							className="certificate-image"
							src={certificateImage}
							alt={t("Certificate", "Certificat")}
							style={{
								width: "100%",
								height: "auto",
								display: "block",
								objectFit: "cover",
								filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
								transition: "filter 0.3s ease",
							}}
						/>
					)}
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0,
						background: "rgba(0, 0, 0, 0.5)",
						transition: "all 0.3s ease",
						cursor: "pointer",
						zIndex: 2,
					}}
				>
					{/* Hover Content */}
					<Box
						className="hover-content"
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -60%)",
							opacity: 0,
							transition: "all 0.4s ease",
							textAlign: "center",
							width: "100%",
							color: "white",
						}}>
						<FullscreenIcon
							sx={{
								fontSize: 48,
								mb: 1,
								filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
							}}
						/>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								fontSize: "1.25rem",
								textShadow: "0 2px 4px rgba(0,0,0,0.4)",
							}}>
							{t("View Certificate", "Voir le certificat")}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Modal */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="certificate-modal"
				slotProps={{
					backdrop: {
						timeout: 300,
						sx: {
							backgroundColor: "rgba(0, 0, 0, 0.9)",
							backdropFilter: "blur(5px)",
						},
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 0,
					padding: 0,
				}}>
				<Box
					sx={{
						position: "relative",
						width: isPdf ? "90vw" : "auto",
						height: isPdf ? "90vh" : "auto",
						maxWidth: "90vw",
						maxHeight: "90vh",
						m: 0,
						p: 0,
						outline: "none",
						"&:focus": {
							outline: "none",
						},
					}}>
					{/* Close Button */}
					<IconButton
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 16,
							top: 16,
							color: "white",
							bgcolor: "rgba(0,0,0,0.6)",
							zIndex: 1,
							padding: 1,
							"&:hover": {
								bgcolor: "rgba(0,0,0,0.8)",
								transform: "scale(1.1)",
							},
						}}
						size="large">
						<CloseIcon sx={{ fontSize: 24 }} />
					</IconButton>

					{/* Modal Content */}
					{isPdf ? (
						<iframe
							src={certificateImage}
							title={t("Certificate Full View", "Vue complète du certificat")}
							style={{
								width: "100%",
								height: "100%",
								border: "none",
								borderRadius: "8px",
							}}
						/>
					) : (
						<img
							src={certificateImage}
							alt={t("Certificate Full View", "Vue complète du certificat")}
							style={{
								display: "block",
								maxWidth: "100%",
								maxHeight: "90vh",
								margin: "0 auto",
								objectFit: "contain",
							}}
						/>
					)}
				</Box>
			</Modal>
		</Box>
	)
}

export default Certificate
