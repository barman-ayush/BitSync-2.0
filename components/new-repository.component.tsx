"use client";

import React, { useState } from "react";
import {
  Book,
  Globe,
  Lock,
  Info,
  AlertCircle,
  FileText,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useFlash } from "./Flash.component";
import { handleClientError } from "@/lib/utils";
import { useUserContext } from "@/context/userContext";
import { AppError } from "@/lib/errorHandler";

interface RepositoryFormData {
  name: string;
  description: string;
  isPublic: boolean;
}

interface ValidationErrors {
  name?: string;
  description?: string;
}

const CreateRepository: React.FC = () => {
  const router = useRouter();
  const { flash } = useFlash();
  const { userData } = useUserContext();

  const [formData, setFormData] = useState<RepositoryFormData>({
    name: "",
    description: "",
    isPublic: true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Repository name is required";
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.name)) {
      newErrors.name =
        "Repository name can only contain letters, numbers, hyphens, underscores, and periods";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdRepo = await axios.post("/api/user/repository/new", {
        ...formData,
        id: userData?.id,
      });

      const response = createdRepo.data;
      if(!response.success) throw new AppError(response.message);

      console.log("Repo Created", response);
      console.log("Creating repo ");
      flash("Repository Created Successfully !!", { variant: "success" });

      // TODO : redirect to repo
      router.push(`/repository/${userData?.username}/${formData.name}`)

    } catch (error) {
      handleClientError(error, "NEW_REPO_CREATION", flash);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-foreground flex items-center">
            <Book className="mr-2" /> Create a new repository
          </h1>

          <div className="bg-card rounded-lg shadow-md p-6 border border-input">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  className="block text-foreground text-sm font-medium mb-2"
                  htmlFor="name"
                >
                  Repository Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full ${
                    errors.name
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                  placeholder="e.g., my-awesome-project"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a unique name for your repository. This will be used in
                  your repository's URL.
                </p>
              </div>

              <div className="mb-6">
                <label
                  className="block text-foreground text-sm font-medium mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full ${
                    errors.description
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                  placeholder="Optional description of your repository"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{" "}
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  <span>
                    {500 - formData.description.length} characters remaining
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <span className="block text-foreground text-sm font-medium mb-2">
                  Visibility
                </span>
                <div className="flex flex-col space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={() =>
                        setFormData({ ...formData, isPublic: true })
                      }
                      className="mr-2 h-4 w-4 text-primary"
                    />
                    <Globe className="mr-2 w-5 h-5 text-primary" />
                    <div>
                      <span className="text-foreground">Public</span>
                      <p className="text-sm text-muted-foreground">
                        Anyone can see this repository. You choose who can
                        commit.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={!formData.isPublic}
                      onChange={() =>
                        setFormData({ ...formData, isPublic: false })
                      }
                      className="mr-2 h-4 w-4 text-primary"
                    />
                    <Lock className="mr-2 w-5 h-5 text-amber-500" />
                    <div>
                      <span className="text-foreground">Private</span>
                      <p className="text-sm text-muted-foreground">
                        You choose who can see and commit to this repository.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 hover:cursor-pointer"
                >
                  {isSubmitting
                    ? "Creating Repository..."
                    : "Create Repository"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRepository;