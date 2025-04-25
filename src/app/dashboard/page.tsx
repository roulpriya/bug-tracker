import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect("/");
  }
  
  // Import organization service
  const { OrganizationService } = await import("@/services");

  // Get all organizations user is part of
  const organizations = await OrganizationService.getOrganizationsByUser(session.user.email);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Organizations</h1>
        <Link href="/dashboard/organizations/new">
          <Button>Create Organization</Button>
        </Link>
      </div>

      {organizations.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">
            You don&apos;t have any organizations yet. Create one to get started!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org: {
            id: string;
            name: string;
            createdAt: Date;
            projects: any[];
          }) => (
            <Link href={`/dashboard/organizations/${org.id}`} key={org.id}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
                <p className="text-sm text-gray-500">
                  Created on {new Date(org.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}