// profileData.ts
export interface Repository {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    language: string;
    languageColor: string;
  }
  
  export interface ProfileData {
    username: string;
    displayName: string;
    avatar: string;
    pronoun: string;
    followers: number;
    following: number;
    location: string;
    email: string;
    linkedin: string;
    pinnedRepos: Repository[];
  }
  
  const profileData: ProfileData = {
    username: "barman-ayush",
    displayName: "Ayush Barman",
    avatar: "/avatar.jpg", // Place an avatar image in your public folder
    pronoun: "he/him",
    followers: 5,
    following: 2,
    location: "Dhanbad, Jharkhand",
    email: "barmanayush2980@gmail.com",
    linkedin: "in/ayush-barman-4856b3229",
    pinnedRepos: [
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
    ]
  };
  
  export default profileData;