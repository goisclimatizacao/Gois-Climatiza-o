// FIX: Removed the self-referential import of `GeneratedPost`, which was causing a conflict as the type is declared within this same file.
export type AspectRatio = '1:1' | '4:3' | '9:16';
export type ConnectionId = 'facebook' | 'instagram' | 'google';

// --- Core Content Structures ---

interface ImagePostContent {
  imagePrompt: string;
  caption: string;
}

export interface CarouselSlide {
    title: string;
    body: string;
}

interface CarouselPostContent {
    coverImagePrompt: string;
    slides: CarouselSlide[];
    caption: string; // Final caption for the post
}

// --- Discriminated Union for Generated Content ---

export type GeneratedPost = 
    | { type: 'image'; content: ImagePostContent }
    | { type: 'carousel'; content: CarouselPostContent };

export interface GeneratedContent {
  id: string; // Unique ID for drafts and tracking
  post: GeneratedPost;
  imageUrls: string[];
  selectedImageUrl: string; // Used for cover image in carousels too
  aspectRatio: AspectRatio;
}

export interface LibraryImage {
  id: string;
  url: string;
  alt: string;
}

export type UserRole = 'admin' | 'marketing';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

// --- New Types for functional pages ---

export interface TeamMember extends User {
  id: string;
}

export interface CompanySettings {
  companyName: string;
  slogan: string;
  location: string;
  services: string;
  voiceTone: string;
  cta: string;
  hashtags: string;
}

export interface PaidCampaign {
  id: string;
  postId: string;
  postContent: GeneratedContent;
  status: 'active' | 'completed';
  budget: number;
  durationDays: number;
  startDate: string; // ISO string
  targetAudience: string;
  mockMetrics: {
    reach: number;
    clicks: number;
  };
}

// --- Template Library Type ---
export interface PostTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  previewImageUrl: string;
  prompt: string;
  type: 'image' | 'carousel' | 'written';
  aspectRatio: AspectRatio;
}


// --- App State Structures ---

export type Draft = GeneratedContent;

export interface ScheduledPost {
  id: string;
  content: GeneratedContent;
  scheduledDate: string; // ISO string
  platforms: ConnectionId[];
}

export interface PublishedPost {
  id:string;
  content: GeneratedContent;
  publishedDate: string; // ISO string
  platforms: ConnectionId[];
}