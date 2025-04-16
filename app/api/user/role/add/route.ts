// File: /api/user/role/add.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Represents role hierarchy from highest to lowest
const ROLE_HIERARCHY = ['owner', 'admin', 'collaborator', 'viewer', 'none'];

export async function POST(req: NextRequest) {
  try {
    // Get request body data - current user and user to add are sent directly from frontend
    const { repoId, currentUserId, userToAddId, role } = await req.json();

    // Validate required inputs
    if (!repoId || !currentUserId || !userToAddId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: repoId, currentUserId, userToAddId, role' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'collaborator', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: admin, collaborator, viewer' },
        { status: 400 }
      );
    }

    // Get repository data with owner and all role relations
    const repo = await prisma.repo.findUnique({
      where: { id: repoId },
      include: {
        owner: true,
        admins: true,
        collaborators: true,
        viewers: true,
      },
    });

    if (!repo) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // Check if currentUser exists
    const currentUserExists = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUserExists) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }

    // Check if userToAdd exists
    const userToAdd = await prisma.user.findUnique({
      where: { id: userToAddId },
    });

    if (!userToAdd) {
      return NextResponse.json({ error: 'User to add not found' }, { status: 404 });
    }

    // Determine current user's role in the repository
    let currentUserRole = 'none';
    
    if (repo.ownerId === currentUserId) {
      currentUserRole = 'owner';
    } else if (repo.admins.some(admin => admin.id === currentUserId)) {
      currentUserRole = 'admin';
    } else if (repo.collaborators.some(collab => collab.id === currentUserId)) {
      currentUserRole = 'collaborator';
    } else if (repo.viewers.some(viewer => viewer.id === currentUserId)) {
      currentUserRole = 'viewer';
    }

    // Determine user to add's current role if any
    let userToAddRole = 'none';
    
    if (repo.ownerId === userToAddId) {
      userToAddRole = 'owner';
    } else if (repo.admins.some(admin => admin.id === userToAddId)) {
      userToAddRole = 'admin';
    } else if (repo.collaborators.some(collab => collab.id === userToAddId)) {
      userToAddRole = 'collaborator';
    } else if (repo.viewers.some(viewer => viewer.id === userToAddId)) {
      userToAddRole = 'viewer';
    }

    // Check if current user has permission to modify roles based on hierarchy
    // A user can only modify roles of users lower in hierarchy than themselves
    if (currentUserRole === 'none') {
      return NextResponse.json(
        { error: 'You do not have permission to access this repository' },
        { status: 403 }
      );
    }
    
    // Determine if current user has permission based on hierarchy
    const currentUserRoleIndex = ROLE_HIERARCHY.indexOf(currentUserRole);
    const roleToAssignIndex = ROLE_HIERARCHY.indexOf(role);
    
    // Users can only assign roles that are lower than their own in the hierarchy
    if (roleToAssignIndex <= currentUserRoleIndex) {
      return NextResponse.json(
        { error: `As a ${currentUserRole}, you cannot assign the ${role} role` },
        { status: 403 }
      );
    }
    
    // If the user to add already has a role, check if current user has permission to change it
    if (userToAddRole !== 'none') {
      const userToAddRoleIndex = ROLE_HIERARCHY.indexOf(userToAddRole);
      
      // Users can only modify roles of users lower than themselves in hierarchy
      if (userToAddRoleIndex <= currentUserRoleIndex) {
        return NextResponse.json(
          { error: `As a ${currentUserRole}, you cannot modify a ${userToAddRole}'s role` },
          { status: 403 }
        );
      }
    }

    // Cannot modify the role of the repository owner
    if (userToAddRole === 'owner') {
      return NextResponse.json(
        { error: 'Cannot modify the role of the repository owner' },
        { status: 403 }
      );
    }

    // Remove user from existing role if they have one
    if (userToAddRole !== 'none') {
      if (userToAddRole === 'admin') {
        await prisma.repo.update({
          where: { id: repoId },
          data: {
            admins: {
              disconnect: { id: userToAddId }
            }
          }
        });
      } else if (userToAddRole === 'collaborator') {
        await prisma.repo.update({
          where: { id: repoId },
          data: {
            collaborators: {
              disconnect: { id: userToAddId }
            }
          }
        });
      } else if (userToAddRole === 'viewer') {
        await prisma.repo.update({
          where: { id: repoId },
          data: {
            viewers: {
              disconnect: { id: userToAddId }
            }
          }
        });
      }
    }

    // Add user to the new role
    await prisma.repo.update({
      where: { id: repoId },
      data: {
        [role === 'admin' ? 'admins' : role === 'collaborator' ? 'collaborators' : 'viewers']: {
          connect: { id: userToAddId }
        }
      }
    });

    return NextResponse.json(
      { success: true, message: `User assigned to ${role} role successfully` },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in role assignment:', error);
    return NextResponse.json(
      { error: 'Failed to assign role to user' },
      { status: 500 }
    );
  }
}