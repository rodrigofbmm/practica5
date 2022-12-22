
export type usuario = {
    username: string;
    password?: string;
    fecha: number;
    idioma?:string;
};

export type mensaje = {
    envio: string;
    destino: string;
    mensaje: string;
    fecha: number;
};