"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import utility from "@/utils/utility";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function VehicleInfoPage() {
  const [carModel, setCarModel] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [maxPictures, setMaxPictures] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [picturePreviews, setPicturePreviews] = useState([]);
  const [errors, setErrors] = useState({ carModel: "", phone: "" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  console.log(userId, "ar ara");
  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    if (pictures.length + newFiles.length > maxPictures) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pictures: `You can only upload up to ${maxPictures} pictures.`,
      }));
      return;
    }
    const newPicturePreviews = await Promise.all(
      newFiles.map(async (file) => {
        const base64 = await utility.convertBase64(file);
        return base64;
      })
    );

    setPictures((prevPictures) => [...prevPictures, ...newFiles]);
    setPicturePreviews((prevPreviews) => [
      ...prevPreviews,
      ...newPicturePreviews,
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { carModel: "", phone: "" };

    if (carModel.length < 3) {
      newErrors.carModel = "Car model must be at least 3 characters long";
      valid = false;
    }

    if (!/^\d{11}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 11 digits";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }
    try {
      const data = {
        carModel,
        price,
        phone,
        maxPictures,
        pictures: picturePreviews,
        user: userId,
      };

      const res = await axios.post("http://localhost:3000/vehicle-info", data);
      if (res.data.success) {
        alert("Vehicle information submitted successfully.");
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (error) {
      alert("An error occurred while submitting the form.");
      console.error("Axios error:", error);
    }
  };
  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Vehicle Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Car Model"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          error={!!errors.carModel}
          helperText={errors.carModel}
        />
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel>Max Number of Pictures</InputLabel>
          <Select
            value={maxPictures}
            onChange={(e) => setMaxPictures(e.target.value)}
            label="Max Number of Pictures"
          >
            {[...Array(10).keys()].map((n) => (
              <MenuItem key={n + 1} value={n + 1}>
                {n + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.pictures && (
          <Typography variant="body2" color="error" align="center">
            {errors.pictures}
          </Typography>
        )}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="upload-button"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button">
          <Button
            variant="contained"
            color="primary"
            component="span"
            // startIcon={<PhotoCamera />}
            fullWidth
            className="uploadButton"
          >
            Upload Pictures
          </Button>
        </label>
        <Box mt={2}>
          <Grid container spacing={2}>
            {picturePreviews.map((src, index) => (
              <Grid item key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={`Preview ${index + 1}`}
                    height="100"
                    image={src}
                    title={`Preview ${index + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={3}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
}
