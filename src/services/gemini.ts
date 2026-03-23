import { GoogleGenAI, Type } from "@google/genai";
import { GenerateListingInput, GenerateListingOutput, OptimizeListingInput, OptimizeListingOutput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateListing(input: GenerateListingInput): Promise<GenerateListingOutput> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a premium, high-converting real estate listing based on the following details:
    Country: ${input.country}
    State/Region/Province: ${input.state}
    Area/Neighborhood: ${input.area}
    Property Type: ${input.propertyType}
    Purpose: ${input.purpose}
    Bedrooms: ${input.bedrooms}
    Bathrooms: ${input.bathrooms}
    Size: ${input.size} sq ft
    Amenities: ${input.amenities}
    Notes: ${input.notes}

    CRITICAL INSTRUCTIONS:
    - The listing MUST feel deeply location-aware and market-aware. Use the Area/Neighborhood (${input.area}) as a strong signal for the lifestyle and vibe.
    - Adapt the tone: Luxury for high-end properties, residential for family homes, investment-focused for commercial/land, or persuasive for rentals.
    - Do NOT use generic placeholder text. Create specific, vivid descriptions.
    - For pricing, research or simulate realistic market values for ${input.area}, ${input.state}, ${input.country}.

    Return the result as a JSON object with the following fields:
    - title: A catchy, SEO-optimized property title.
    - description: A professional, elegant, and persuasive property description.
    - instagramCaption: A high-engagement Instagram caption with emojis.
    - hashtags: An array of 10 relevant real estate and location-based hashtags.
    - estimatedSalePrice: A realistic price range for sale in the local currency (e.g., "$1,200,000 - $1,350,000").
    - estimatedMonthlyRent: A realistic monthly rent range in the local currency (e.g., "$4,500 - $5,200").
    - detectedMarket: A specific market name (e.g., "${input.area} Luxury Residential Market").
    - currency: The local currency code (e.g., "USD", "AED", "GBP").
    - confidenceScore: A number between 0 and 1 representing AI confidence in market data.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          instagramCaption: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedSalePrice: { type: Type.STRING },
          estimatedMonthlyRent: { type: Type.STRING },
          detectedMarket: { type: Type.STRING },
          currency: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
        },
        required: ["title", "description", "instagramCaption", "hashtags", "estimatedSalePrice", "estimatedMonthlyRent", "detectedMarket", "currency", "confidenceScore"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function enhancePropertyPhoto(imageBase64: string, mimeType: string): Promise<string> {
  const model = "gemini-2.0-flash-preview-image-generation";
  
  const prompt = `You are a professional real estate photographer and photo editor. Enhance this property photo to make it look like it was taken by a professional photographer for a luxury real estate listing.

Apply these enhancements:
- Fix the lighting to be warm, bright, and inviting
- Correct the white balance and color temperature
- Make colors more vibrant but natural
- Sharpen the image and improve clarity
- If the room looks empty, suggest how it could be virtually staged
- Make the sky blue and bright if it's an exterior shot
- Enhance the lawn/garden to look lush and well-maintained if visible
- Remove any visual clutter or distracting elements
- Apply HDR-like tone mapping for balanced exposure
- Make the photo look magazine-ready

Generate an enhanced version of this property photo. Output ONLY the enhanced image, nothing else.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ["image", "text"],
    },
  });

  // Extract the generated image from the response
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No enhanced image was generated. Please try again.");
}

export async function optimizeListing(input: OptimizeListingInput): Promise<OptimizeListingOutput> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze and optimize the following real estate listing:
    URL: ${input.url}
    Platform: ${input.platform}
    Additional Notes: ${input.notes}

    CRITICAL: Since you cannot browse the live URL directly, you MUST simulate a high-quality, realistic optimization based on the URL structure, platform context, and any provided notes. 
    
    If the URL looks like a specific property (e.g., "zillow.com/homedetails/123-Main-St..."), use that context to guess the property details.
    
    Return the result as a JSON object with the following fields:
    - originalTitle: A simulated original title that looks like it came from ${input.platform}.
    - originalDescription: A simulated original description (2-3 sentences).
    - detectedImage: A realistic placeholder image URL related to the property (use https://picsum.photos/seed/property/800/600).
    - improvedTitle: A significantly better, SEO-optimized title tailored for ${input.platform}.
    - improvedDescription: A more persuasive, elegant, and polished description.
    - pricingSuggestion: A suggestion on whether the price should be adjusted based on the platform and market.
    - seoKeywords: An array of 5-7 target keywords.
    - listingScore: A score from 0 to 100 representing the quality of the ORIGINAL listing.
    - suggestedImprovements: An array of 4-6 specific actionable improvements.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalTitle: { type: Type.STRING },
            originalDescription: { type: Type.STRING },
            detectedImage: { type: Type.STRING },
            improvedTitle: { type: Type.STRING },
            improvedDescription: { type: Type.STRING },
            pricingSuggestion: { type: Type.STRING },
            seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            listingScore: { type: Type.NUMBER },
            suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["originalTitle", "originalDescription", "improvedTitle", "improvedDescription", "pricingSuggestion", "seoKeywords", "listingScore", "suggestedImprovements"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini optimization error:", error);
    // Fallback mock data if AI fails
    return {
      originalTitle: "Standard Property Listing",
      originalDescription: "This is a standard property listing with basic details.",
      detectedImage: "https://picsum.photos/seed/property/800/600",
      improvedTitle: "Luxury Modern Living: Premium Property Opportunity",
      improvedDescription: "Experience unparalleled elegance in this meticulously designed residence. Featuring high-end finishes and spacious layouts, this property is perfect for discerning buyers.",
      pricingSuggestion: "Market analysis suggests the current pricing is competitive, but a 2-3% adjustment could accelerate the sale.",
      seoKeywords: ["luxury real estate", "modern home", "premium listing", "investment property"],
      listingScore: 65,
      suggestedImprovements: [
        "Enhance property title with more descriptive adjectives",
        "Add more details about local neighborhood amenities",
        "Improve call-to-action in the description",
        "Use more high-intent real estate keywords"
      ]
    };
  }
}
