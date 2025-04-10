"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Star, GitFork, Code, Calendar, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Define types for repository data
interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  languageColor: string;
  updatedAt: Date;
  isPublic: boolean;
}

// Define component props
interface ExploreRepositoriesProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
  filter?: 'trending' | 'popular' | 'newest' | 'all';
}

const ExploreRepositories: React.FC<ExploreRepositoriesProps> = ({
  limit = 3,
  showHeader = true,
  className = '',
  filter = 'trending'
}) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(filter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Format date to relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  // Get language badge color
  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3572A5',
      Java: '#b07219',
      'C#': '#178600',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051'
    };
    
    return colors[language] || '#6e7681';
  };

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    fetchRepositories(newFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredRepositories(repositories);
    } else {
      const filtered = repositories.filter(repo => 
        repo.name.toLowerCase().includes(query) || 
        repo.owner.toLowerCase().includes(query) ||
        (repo.description && repo.description.toLowerCase().includes(query))
      );
      setFilteredRepositories(filtered);
    }
  };

  const fetchRepositories = async (filterType: string) => {
    setLoading(true);
    try {
      // In a real app, you would fetch from an API with proper filtering
      // For now, we'll use mock data
      const mockRepositories: Repository[] = [
        {
          id: '1',
          name: 'bitsync-core',
          owner: 'bitsync',
          description: 'Core functionality for the BitSync distributed version control system',
          stars: 126,
          forks: 18,
          watchers: 42,
          language: 'TypeScript',
          languageColor: '#3178c6',
          updatedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
          isPublic: true
        },
        {
          id: '2',
          name: 'bitsync-cli',
          owner: 'bitsync',
          description: 'Command line interface for BitSync - manage your repositories with ease',
          stars: 92,
          forks: 11,
          watchers: 34,
          language: 'TypeScript',
          languageColor: '#3178c6',
          updatedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
          isPublic: true
        },
        {
          id: '3',
          name: 'react-sync-components',
          owner: 'janesmith',
          description: 'Reusable React components for version control UI',
          stars: 78,
          forks: 23,
          watchers: 15,
          language: 'JavaScript',
          languageColor: '#f7df1e',
          updatedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
          isPublic: true
        },
        {
          id: '4',
          name: 'bitsync-documentation',
          owner: 'bitsync',
          description: 'Official documentation and examples for BitSync',
          stars: 65,
          forks: 34,
          watchers: 27,
          language: 'Markdown',
          languageColor: '#083fa1',
          updatedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
          isPublic: true
        },
        {
          id: '5',
          name: 'sync-python-api',
          owner: 'johndoe',
          description: 'Python wrapper for the BitSync API',
          stars: 42,
          forks: 13,
          watchers: 9,
          language: 'Python',
          languageColor: '#3572A5',
          updatedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
          isPublic: true
        }
      ];
      
      // Apply filter logic (in a real app, this would be handled server-side)
      let filteredRepos = [...mockRepositories];
      switch (filterType) {
        case 'trending':
          filteredRepos.sort((a, b) => b.stars - a.stars);
          break;
        case 'popular':
          filteredRepos.sort((a, b) => (b.stars + b.forks) - (a.stars + a.forks));
          break;
        case 'newest':
          filteredRepos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          break;
        default:
          // 'all' filter - no additional sorting
          break;
      }
      
      // Simulate API delay
      setTimeout(() => {
        setRepositories(filteredRepos);
        setFilteredRepositories(filteredRepos);
        setLoading(false);
      }, 600);
    } catch (err) {
      setError('Failed to load repositories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories(filter);
  }, [filter]);

  const filterOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'popular', label: 'Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'all', label: 'All' }
  ];

  return (
    <div className={`bg-background border border-input rounded-lg shadow-md p-6 min-h-screen flex flex-col ${className}`}>
      {showHeader && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold flex items-center text-foreground">
            <Globe className="text-primary mr-2" />
            Explore Repositories
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Input
                className="pl-9 h-9 w-full sm:w-64 bg-muted border-input text-sm rounded-md"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeFilter === option.value
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center text-destructive py-4 text-center">
          {error}
        </div>
      ) : filteredRepositories.length === 0 ? (
        <div className="flex-1 flex justify-center items-center text-muted-foreground italic py-4 text-center">
          {searchQuery ? "No repositories match your search." : "No public repositories available yet."}
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {filteredRepositories.slice(0, limit).map(repo => (
            <Link 
              key={repo.id} 
              href={`/${repo.owner}/${repo.name}`}
              className="block border border-input rounded-lg p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-primary flex items-center">
                    <Code className="w-4 h-4 mr-1.5" />
                    {repo.owner}/{repo.name}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                    {repo.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {repo.language && (
                  <div className="flex items-center text-muted-foreground">
                    <span 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></span>
                    {repo.language}
                  </div>
                )}
                
                <div className="flex items-center text-muted-foreground">
                  <Star className="w-4 h-4 mr-1" />
                  {repo.stars}
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <GitFork className="w-4 h-4 mr-1" />
                  {repo.forks}
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  Updated {formatRelativeTime(repo.updatedAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreRepositories;