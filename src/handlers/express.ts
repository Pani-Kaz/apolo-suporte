import express, { Request, Response } from "express";
import prisma from "../common/config/prisma";

const app = express();

app.use(express.json());

app.get("/:id", async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id as string;

    try {
        const ticket = await prisma.tickets.findUnique({
            where: { id },
            select: { transcript_data: true }
        });

        if (!ticket || !ticket.transcript_data) {
            return res.status(404).send("Transcrição não encontrada");
        }

        const htmlBuffer = Buffer.from(ticket.transcript_data, "base64");
        res.setHeader("Content-Type", "text/html");
        return res.send(htmlBuffer);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao buscar a transcrição");
    }
});

export default app;