import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  File,
  Image as ImageIcon,
  FileText,
  MoreVertical,
  Upload,
  Search,
  HardDrive,
  FolderOpen
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const FileManagerPage = () => {
  const [files] = useState([
    { name: 'company_logo.png', size: '1.2 MB', type: 'image/png', modified: '2024-03-20' },
    { name: 'onboarding_guide.pdf', size: '4.5 MB', type: 'application/pdf', modified: '2024-03-18' },
    { name: 'budget_q1.xlsx', size: '850 KB', type: 'spreadsheet', modified: '2024-03-15' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">File Manager</h2>
          <p className="text-muted-foreground">Manage organizational assets and form attachments.</p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-8 w-8 text-primary opacity-20" />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>6.5 MB of 100 MB used</span>
                  <span>6%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[6%]" />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm">
                <FolderOpen className="h-4 w-4" /> All Files
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm">
                <ImageIcon className="h-4 w-4" /> Images
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm">
                <FileText className="h-4 w-4" /> Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-bold">Recent Files</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-8 h-9" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center">
                          <File className="h-4 w-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-sm">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{file.size}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{file.modified}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileManagerPage;
