import { api } from "@/lib/api";

export const supportService = {
    // Traemos los tipos de usuario
    getTipos: async () => {
        const response = await api.get("/tipo_usuario", {
            orderBy: {
                Nombre_TipoUsuario: "ASC",
            },
        }); // Ajusta esta URL a tu API real
        return response.data.data;
    },

    // Traemos las sucursales
    getSucursales: async () => {
        const response = await api.get("/sucursal", {
            orderBy: {
                Nombre: "ASC",
            },
        }); // Ajusta esta URL a tu API real
        return response.data.data;
    },
};
