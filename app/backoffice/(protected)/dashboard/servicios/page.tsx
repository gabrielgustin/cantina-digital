import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Search, MoreHorizontal } from "lucide-react"

const services = [
  {
    id: "SRV-001",
    name: "Hosting Básico",
    type: "Hosting",
    price: "$99.00",
    clients: 45,
    status: "Activo",
  },
  {
    id: "SRV-002",
    name: "Hosting Premium",
    type: "Hosting",
    price: "$199.00",
    clients: 32,
    status: "Activo",
  },
  {
    id: "SRV-003",
    name: "Dominio .com",
    type: "Dominio",
    price: "$15.00",
    clients: 78,
    status: "Activo",
  },
  {
    id: "SRV-004",
    name: "Certificado SSL",
    type: "Seguridad",
    price: "$49.00",
    clients: 56,
    status: "Activo",
  },
  {
    id: "SRV-005",
    name: "Email Empresarial",
    type: "Email",
    price: "$5.00",
    clients: 23,
    status: "Inactivo",
  },
]

export default function ServiciosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Servicios</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar servicios..." className="w-full rounded-md pl-8 md:w-[300px]" />
          </div>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Servicios</CardTitle>
          <CardDescription>Gestiona los servicios que ofreces a tus clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.id}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.type}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{service.clients}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        service.status === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.status}
                    </span>
                  </TableCell>
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
