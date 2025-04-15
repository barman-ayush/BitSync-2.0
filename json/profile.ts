// lib/profileData.ts

export interface ProfileData {
    displayName: string;
    username: string;
    pronoun: string;
    avatar: string;
    location: string;
    email: string;
    linkedin: string;
    followers: number;
    following: number;
  }
  
  export interface Repository {
    id: string;
    name: string;
    isPublic: boolean;
    description?: string;
    language: string;
    languageColor: string;
  }
  
  export const profileData: ProfileData = {
    displayName: "Ayush Barman",
    username: "barman-ayush",
    pronoun: "he/him",
    avatar: "/avatar.jpg", // You'll need to place an avatar image in your public folder
    location: "Dhanbad, Jharkhand",
    email: "barmanayush2980@gmail.com",
    linkedin: "in/ayush-barman-4856b3229",
    followers: 5,
    following: 2
  };
  
  export const pinnedRepos: Repository[] = [
    {
      id: "1",
      name: "arcana.ai",
      isPublic: true,
      language: "TypeScript",
      languageColor: "#3178c6"
    },
    {
      id: "2",
      name: "Barman-s-Portfolio",
      isPublic: true,
      language: "JavaScript",
      languageColor: "#f7df1e"
    },
    {
      id: "3",
      name: "Dermi-check",
      isPublic: true,
      language: "Python",
      languageColor: "#3572A5"
    },
    {
      id: "4",
      name: "GetGeeks",
      isPublic: true,
      description: "Getgeeks is a platform designed to provide competitive coders with a robust community and a comprehensive solution for tracking the progress of peers. It integrates with both Codeforces and CodeChe...",
      language: "EJS",
      languageColor: "#a91e50"
    }
  ];