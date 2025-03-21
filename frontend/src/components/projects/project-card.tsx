import { Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg text-gray-900">
            {project.Name}
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 