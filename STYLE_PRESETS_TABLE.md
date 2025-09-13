# Sellora Style Presets - Human Readable Table

## Overview
This table shows the predefined style presets available in the StylePicker component, with their corresponding parameter values and descriptions.

## Style Presets Table

| Style | Description | Contrast | Saturation | Sharpen | Skin Softness | Crop | Retouch Strength |
|-------|-------------|----------|------------|---------|---------------|------|------------------|
| **Delicate** | Soft, gentle enhancement | -20 | -15 | 0.3 | 0.8 | Auto | 0.6 |
| **Minimalist** | Clean, understated look | -30 | -25 | 0.2 | 0.9 | Auto | 0.4 |
| **Maximalist** | Bold, dramatic styling | 40 | 35 | 0.7 | 0.3 | Auto | 0.9 |
| **Editorial** | High-fashion magazine style | 25 | 20 | 0.8 | 0.5 | Portrait | 0.7 |
| **Glossy** | Shiny, polished finish | 15 | 30 | 0.6 | 0.4 | Auto | 0.8 |
| **Natural** | Authentic, unprocessed look | -10 | -5 | 0.4 | 0.7 | Auto | 0.5 |
| **Cinematic** | Movie-quality dramatic effect | 35 | 15 | 0.9 | 0.6 | Auto | 0.8 |
| **Studio Flatlay** | Professional product photography | 20 | 25 | 0.5 | 0.2 | Square | 0.6 |
| **High Detail** | Sharp, detailed enhancement | 30 | 20 | 1.0 | 0.1 | Auto | 0.9 |
| **Soft Light** | Gentle, diffused lighting | -25 | -20 | 0.2 | 0.9 | Auto | 0.3 |

## Parameter Definitions

### Contrast (-100 to 100)
- **Negative values**: Reduce contrast, create softer, more muted look
- **Positive values**: Increase contrast, create more dramatic, punchy look
- **Zero**: No contrast adjustment

### Saturation (-100 to 100)
- **Negative values**: Desaturate colors, create muted, vintage look
- **Positive values**: Increase color intensity, create vibrant, bold look
- **Zero**: No saturation adjustment

### Sharpen (0.0 to 1.0)
- **0.0**: No sharpening applied
- **0.5**: Moderate sharpening for general use
- **1.0**: Maximum sharpening for high-detail styles

### Skin Softness (0.0 to 1.0)
- **0.0**: No skin smoothing (preserve all texture)
- **0.5**: Moderate skin smoothing
- **1.0**: Maximum skin smoothing (very soft, airbrushed look)

### Crop Options
- **Auto**: Let AI determine best crop based on content
- **Square**: Force 1:1 aspect ratio (Instagram-style)
- **Portrait**: Force vertical orientation (9:16 or similar)

### Retouch Strength (0.0 to 1.0)
- **0.0**: No retouching applied
- **0.5**: Moderate retouching
- **1.0**: Maximum retouching (heavily processed)

## Style Categories

### **Soft & Subtle**
- **Delicate**: Perfect for beauty products, gentle enhancement
- **Minimalist**: Clean, modern look for minimalist brands
- **Natural**: Authentic look for organic/natural products
- **Soft Light**: Gentle, diffused lighting for soft aesthetics

### **Bold & Dramatic**
- **Maximalist**: High-impact styling for bold brands
- **Cinematic**: Movie-quality effects for luxury products
- **High Detail**: Sharp, detailed enhancement for technical products

### **Professional & Editorial**
- **Editorial**: High-fashion magazine style
- **Studio Flatlay**: Professional product photography
- **Glossy**: Shiny, polished finish for luxury items

## Usage Examples

### Beauty & Cosmetics
- **Delicate**: Soft enhancement for skincare products
- **Glossy**: Shiny finish for lipsticks and glosses
- **Natural**: Authentic look for organic beauty products

### Fashion & Apparel
- **Editorial**: High-fashion magazine style
- **Cinematic**: Dramatic effects for luxury fashion
- **Minimalist**: Clean look for modern fashion brands

### Product Photography
- **Studio Flatlay**: Professional product shots
- **High Detail**: Technical products requiring sharp details
- **Soft Light**: Gentle lighting for delicate products

### Social Media
- **Square Crop**: Instagram-ready posts
- **Portrait Crop**: Stories and vertical content
- **Auto Crop**: Flexible for various platforms

## Customization

Users can:
1. **Select a preset** as a starting point
2. **Adjust strength** (0-100%) to control overall intensity
3. **Fine-tune parameters** in advanced mode
4. **Preview changes** in real-time
5. **Save custom combinations** for future use

## Technical Implementation

### JSON Structure
```json
{
  "contrast": -20,
  "saturation": -15,
  "sharpen": 0.3,
  "skinSoftness": 0.8,
  "crop": "auto",
  "retouchStrength": 0.6
}
```

### API Payload
```json
{
  "job_id": "job_123456789",
  "productName": "Velvet Glow Serum",
  "brandName": "Luxe Beauty Co.",
  "style": "Delicate",
  "styleParams": {
    "contrast": -20,
    "saturation": -15,
    "sharpen": 0.3,
    "skinSoftness": 0.8,
    "crop": "auto",
    "retouchStrength": 0.3
  },
  "originalFileReference": "job_123456789"
}
```

## Best Practices

1. **Start with presets** - Use predefined styles as starting points
2. **Adjust strength** - Fine-tune overall intensity with the strength slider
3. **Preview changes** - Always preview before confirming
4. **Test different crops** - Try different crop options for your platform
5. **Consider your brand** - Choose styles that match your brand aesthetic
6. **Save favorites** - Keep track of successful combinations

## Performance Notes

- **Client-side preview** uses canvas-based image processing
- **Real-time updates** apply filters as you adjust parameters
- **Memory management** includes proper cleanup of blob URLs
- **Mobile optimized** with touch-friendly controls
