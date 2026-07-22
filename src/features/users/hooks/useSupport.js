import { useQuery } from "@tanstack/react-query";
import { supportService } from "../services/support.service";

export const useTipoUsuario = () => {
    return useQuery({
        queryKey: ["tipoUsuario"],
        queryFn: supportService.getTipos,
        // Como estos datos casi nunca cambian, los dejamos en caché por 1 hora
        staleTime: 1000 * 60 * 60,
    });
};

export const useSucursales = () => {
    return useQuery({
        queryKey: ["sucursales"],
        queryFn: supportService.getSucursales,
        staleTime: 1000 * 60 * 60,
    });
};
