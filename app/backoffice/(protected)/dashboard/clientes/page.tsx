import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Search, MoreHorizontal } from "lucide-react"

const clients = [
  {
    id: "CL-001",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+54 11 1234-5678",
    status: "Activo",
    services: 3,
  },
  {
    id: "CL-002",
    name: "María García",
    email: "maria@example.com",
    phone: "+54 11 2345-6789",
    status: "Activo",
    services: 2,
  },
  {
    id: "CL-003",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "+54 11 3456-7890",
    status: "Inactivo",
    services: 0,
  },
  {
    id: "CL-004",
    name: "Ana Martínez",
    email: "ana@example.com",
    phone: "+54 11 4567-8901",
    status: "Activo",
    services: 1,
  },
  {
    id: "CL-005",
    name: "Roberto López",
    email: "roberto@example.com",
    phone: "+54 11 5678-9012",
    status: "Pendiente",
    services: 1,
  },
]

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar clientes..." className="w-full rounded-md pl-8 md:w-[300px]" />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
          <CardDescription>Gestiona tus clientes y sus servicios contratados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.status === "Activo"
                          ? "bg-green-100 text-green-800"
                          : client.status === "Inactivo"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </TableCell>
                  <TableCell>{client.services}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Acciones</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
