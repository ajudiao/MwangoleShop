
// Importa tipos Request e Response do Express
import { Request, Response } from "express";
// Importa instância do Prisma para operações de banco de dados
import { prisma } from "../config/prisma.js";
// Importa bcrypt para hash de senhas
import bcrypt from "bcrypt"
// Importa jsonwebtoken para geração de tokens JWT
import jwt from "jsonwebtoken";

// Gera um token JWT assinado com o ID do usuário e chave secreta
const generateToken = (id: string) => {
    // Assina um token com o ID do usuário, válido por 30 dias
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" })
}

// Verifica se o email do usuário está na lista de administradores
const getAdminStatus = (email: string | null | undefined): boolean => {
    // Retorna false se o email não for fornecido
    if (!email) return false
    // Obtém a lista de emails de admin das variáveis de ambiente e converte para minúsculas
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim().toLowerCase()) || []
    // Verifica se o email do usuário está na lista de admins
    return adminEmails.includes(email.toLowerCase())
}

// Função para registrar um novo usuário
// POST /api/auth/register 
export const register = async (req: Request, res: Response) => {
    // Extrai name, email e password do corpo da requisição
    const { name, email, password } = req.body

    // Valida se todos os campos obrigatórios foram fornecidos
    if (!name || !email || !password)
        return res.status(400).json({ message: "Please provide all fields" })
    // Busca um usuário existente com o mesmo email (case-insensitive)
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    
    // Retorna erro se o usuário já existe
    if (existingUser)
        return res.status(400).json({ message: "User already exists" })
    // Hash da senha com salt de 10 rodadas
    const hashedPassword = await bcrypt.hash(password, 10)
    // Cria um novo usuário no banco de dados
    const user = await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        }
    })

    // Gera um token JWT para o usuário criado
    const token = generateToken(user.id)

    // Cria uma cópia dos dados do usuário
    const userData: any = { ...user }
    // Remove a senha da resposta por segurança
    delete userData.password

    // Adiciona informação de status de admin ao usuário
    userData.isAdmin = getAdminStatus(userData.email)

    // Retorna o usuário e token com status 201 (Created)
    res.status(201).json({ user: userData, token })

}

// Função para fazer login de um usuário
// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    // Extrai email e password do corpo da requisição
    const { email, password } = req.body

    // Valida se email e password foram fornecidos
    if (!email || !password)
        return res.status(400).json({ message: "Please provide all fields" })
    // Busca o usuário pelo email e inclui seus endereços
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase()}, include: { addresses: true } })
    // Retorna erro se o usuário não existe
    if (!user)
        return res.status(401).json({ message: "User not found with this email" })
    // Compara a senha fornecida com a senha hasheada do banco de dados
    const isMatch = await bcrypt.compare(password, user.password)
    // Retorna erro se as senhas não coincidirem
    if (!isMatch)
        return res.status(401).json({ message: "Invalid email or password" })
    // Gera um token JWT para o usuário autenticado
    const token = generateToken(user.id)
    // Cria uma cópia dos dados do usuário
    const userData: any = { ...user }
    // Remove a senha da resposta por segurança
    delete userData.password

    // Adiciona informação de status de admin ao usuário
    userData.isAdmin = getAdminStatus(userData.email)

    // Retorna o usuário e token com status 200 (OK)
    res.status(200).json({ user: userData, token })
}
