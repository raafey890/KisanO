from modules.admin.constants import AdminRole, AdminPermissions

ROLE_PERMISSIONS = {
    AdminRole.SUPER_ADMIN: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_USERS,
        AdminPermissions.MANAGE_EQUIPMENT,
        AdminPermissions.MANAGE_MARKETPLACE,
        AdminPermissions.MANAGE_FINANCE,
        AdminPermissions.MANAGE_SUPPORT,
        AdminPermissions.MANAGE_SETTINGS,
        AdminPermissions.MANAGE_ROLES,
        AdminPermissions.VIEW_AUDIT_LOGS
    ],
    AdminRole.ADMIN: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_USERS,
        AdminPermissions.MANAGE_EQUIPMENT,
        AdminPermissions.MANAGE_MARKETPLACE,
        AdminPermissions.MANAGE_SUPPORT,
        AdminPermissions.VIEW_AUDIT_LOGS
    ],
    AdminRole.FINANCE_MANAGER: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_FINANCE
    ],
    AdminRole.SUPPORT_MANAGER: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_SUPPORT,
        AdminPermissions.MANAGE_USERS
    ],
    AdminRole.SUPPORT_AGENT: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_SUPPORT
    ],
    AdminRole.OPERATIONS_MANAGER: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_EQUIPMENT,
        AdminPermissions.MANAGE_MARKETPLACE
    ],
    AdminRole.MODERATOR: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.MANAGE_EQUIPMENT,
        AdminPermissions.MANAGE_MARKETPLACE
    ],
    AdminRole.READ_ONLY_ADMIN: [
        AdminPermissions.VIEW_DASHBOARD,
        AdminPermissions.VIEW_AUDIT_LOGS
    ]
}

def get_role_permissions(role: str) -> list:
    return ROLE_PERMISSIONS.get(role, [])
