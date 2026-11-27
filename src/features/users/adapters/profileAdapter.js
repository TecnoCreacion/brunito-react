export const adaptProfileFromApi = (apiUser) => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    emailHistories: (apiUser.email_histories ?? []).map((item) => ({
        id: item.id,
        email: item.email,
        isActive: Boolean(item.is_active),
        createdAt: item.created_at,
        deactivatedAt: item.deactivated_at,
    })),
});
