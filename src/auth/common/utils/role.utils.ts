// import { Role } from '@prisma/client';

// /**
//  * Role hierarchy levels
//  * Higher numbers = more privileges
//  */
// export const ROLE_HIERARCHY: Record<Role, number> = {
//     'USER': 1,
//     'MEMBER': 2,
//     'ADMIN': 3
// };

// /**
//  * Check if a user role has access to required roles
//  * Supports role hierarchy: ADMIN > MEMBER > USER
//  */
// export function hasRoleAccess(userRole: Role, requiredRoles: Role[]): boolean {
//     // Direct role match
//     if (requiredRoles.includes(userRole)) {
//         return true;
//     }

//     const userRoleLevel = ROLE_HIERARCHY[userRole];
    
//     // Check if user's role level is higher than or equal to any required role
//     return requiredRoles.some(requiredRole => {
//         const requiredRoleLevel = ROLE_HIERARCHY[requiredRole];
//         return userRoleLevel >= requiredRoleLevel;
//     });
// }

// /**
//  * Get all roles that a user has access to based on their role
//  */
// export function getAccessibleRoles(userRole: Role): Role[] {
//     const userRoleLevel = ROLE_HIERARCHY[userRole];
    
//     return Object.entries(ROLE_HIERARCHY)
//         .filter(([_, level]) => level <= userRoleLevel)
//         .map(([role]) => role as Role);
// }

// /**
//  * Check if a role is higher than or equal to another role
//  */
// export function isRoleHigherOrEqual(userRole: Role, requiredRole: Role): boolean {
//     return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
// } 