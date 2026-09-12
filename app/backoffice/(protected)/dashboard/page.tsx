import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart3, Building2, CreditCard, DollarSign, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,324</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">12%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">7.2%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">4.3%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturación Pendiente</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.00</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              <span className="text-red-500 font-medium">3.1%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen de Ingresos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px] flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">Cliente {i}</p>
                    <p className="text-sm text-muted-foreground">Acción realizada</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    Hace {i} hora{i !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
