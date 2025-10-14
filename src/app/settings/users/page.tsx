"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserCheck, 
  UserX,
  Search,
  Mail,
  Phone,
  Building,
  Shield,
  Users,
  CircleUserRound,
  ChevronLeft,
  ChevronRight,
  Key
} from 'lucide-react'

interface User {
  id: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  department: string
  role: 'admin' | 'supervisor' | 'user'
  allowedDivisions: string[]
  status: 'active' | 'disabled'
  joinDate: string
}

export default function SettingsUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      fullName: 'John Doe',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '+1 (555) 123-4567',
      department: 'Customer Service',
      role: 'admin',
      allowedDivisions: ['Sales', 'Support', 'Billing'],
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      emailAddress: 'jane.smith@example.com',
      phoneNumber: '+1 (555) 234-5678',
      department: 'Sales',
      role: 'supervisor',
      allowedDivisions: ['Sales', 'Marketing'],
      status: 'active',
      joinDate: '2023-02-20'
    },
    {
      id: '3',
      fullName: 'Mike Johnson',
      emailAddress: 'mike.johnson@example.com',
      phoneNumber: '+1 (555) 345-6789',
      department: 'Support',
      role: 'user',
      allowedDivisions: ['Support'],
      status: 'disabled',
      joinDate: '2023-03-10'
    },
    {
      id: '4',
      fullName: 'Sarah Wilson',
      emailAddress: 'sarah.wilson@example.com',
      phoneNumber: '+1 (555) 456-7890',
      department: 'Billing',
      role: 'supervisor',
      allowedDivisions: ['Billing', 'Finance'],
      status: 'active',
      joinDate: '2023-04-05'
    },
    {
      id: '5',
      fullName: 'David Brown',
      emailAddress: 'david.brown@example.com',
      phoneNumber: '+1 (555) 567-8901',
      department: 'Marketing',
      role: 'user',
      allowedDivisions: ['Marketing', 'Sales'],
      status: 'active',
      joinDate: '2023-05-12'
    },
    {
      id: '6',
      fullName: 'Emily Davis',
      emailAddress: 'emily.davis@example.com',
      phoneNumber: '+1 (555) 678-9012',
      department: 'IT',
      role: 'admin',
      allowedDivisions: ['IT', 'Support', 'Operations'],
      status: 'active',
      joinDate: '2023-06-18'
    },
    {
      id: '7',
      fullName: 'Robert Miller',
      emailAddress: 'robert.miller@example.com',
      phoneNumber: '+1 (555) 789-0123',
      department: 'HR',
      role: 'supervisor',
      allowedDivisions: ['HR', 'Operations'],
      status: 'active',
      joinDate: '2023-07-22'
    },
    {
      id: '8',
      fullName: 'Lisa Anderson',
      emailAddress: 'lisa.anderson@example.com',
      phoneNumber: '+1 (555) 890-1234',
      department: 'Operations',
      role: 'user',
      allowedDivisions: ['Operations'],
      status: 'disabled',
      joinDate: '2023-08-30'
    },
    {
      id: '9',
      fullName: 'James Taylor',
      emailAddress: 'james.taylor@example.com',
      phoneNumber: '+1 (555) 901-2345',
      department: 'Customer Service',
      role: 'user',
      allowedDivisions: ['Customer Service', 'Support'],
      status: 'active',
      joinDate: '2023-09-14'
    },
    {
      id: '10',
      fullName: 'Jennifer White',
      emailAddress: 'jennifer.white@example.com',
      phoneNumber: '+1 (555) 012-3456',
      department: 'Sales',
      role: 'user',
      allowedDivisions: ['Sales'],
      status: 'active',
      joinDate: '2023-10-08'
    },
    {
      id: '11',
      fullName: 'Michael Garcia',
      emailAddress: 'michael.garcia@example.com',
      phoneNumber: '+1 (555) 123-4567',
      department: 'Support',
      role: 'supervisor',
      allowedDivisions: ['Support', 'IT'],
      status: 'active',
      joinDate: '2023-11-15'
    },
    {
      id: '12',
      fullName: 'Amanda Martinez',
      emailAddress: 'amanda.martinez@example.com',
      phoneNumber: '+1 (555) 234-5678',
      department: 'Billing',
      role: 'user',
      allowedDivisions: ['Billing'],
      status: 'disabled',
      joinDate: '2023-12-01'
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    department: '',
    role: 'user' as 'admin' | 'supervisor' | 'user',
    allowedDivisions: [] as string[]
  })

  // Confirmation dialog states
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [resetPasswordConfirmOpen, setResetPasswordConfirmOpen] = useState(false)
  const [pendingStatusUser, setPendingStatusUser] = useState<User | null>(null)
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | null>(null)
  const [pendingResetPasswordUser, setPendingResetPasswordUser] = useState<User | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const departments = ['Customer Service', 'Sales', 'Support', 'Billing', 'Marketing', 'IT', 'HR']
  const divisions = ['Sales', 'Support', 'Billing', 'Marketing', 'IT', 'HR', 'Operations']

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.fullName || !formData.emailAddress || !formData.phoneNumber || !formData.department) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ))
      toast.success('User updated successfully')
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      }
      setUsers(prev => [...prev, newUser])
      toast.success('User added successfully')
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      department: user.department,
      role: user.role,
      allowedDivisions: user.allowedDivisions
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setPendingDeleteUser(user)
      setDeleteConfirmOpen(true)
    }
  }

  const confirmDelete = () => {
    if (pendingDeleteUser) {
      setUsers(prev => prev.filter(user => user.id !== pendingDeleteUser.id))
      toast.success('User deleted successfully')
      setDeleteConfirmOpen(false)
      setPendingDeleteUser(null)
    }
  }

  const handleToggleStatus = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setPendingStatusUser(user)
      setStatusConfirmOpen(true)
    }
  }

  const confirmStatusChange = () => {
    if (pendingStatusUser) {
      setUsers(prev => prev.map(user => 
        user.id === pendingStatusUser.id 
          ? { ...user, status: user.status === 'active' ? 'disabled' : 'active' }
          : user
      ))
      toast.success(`User ${pendingStatusUser.status === 'active' ? 'disabled' : 'enabled'} successfully`)
      setStatusConfirmOpen(false)
      setPendingStatusUser(null)
    }
  }

  const handleResetPassword = (user: User) => {
    setPendingResetPasswordUser(user)
    setResetPasswordConfirmOpen(true)
  }

  const confirmResetPassword = () => {
    if (pendingResetPasswordUser) {
      // In a real application, this would call an API to reset the password
      // For demo purposes, we'll just show a success message
      toast.success(`Password reset successfully for ${pendingResetPasswordUser.fullName}. New password sent to email.`)
      setResetPasswordConfirmOpen(false)
      setPendingResetPasswordUser(null)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      department: '',
      role: 'user',
      allowedDivisions: []
    })
    setEditingUser(null)
  }

  const handleDivisionToggle = (division: string) => {
    setFormData(prev => ({
      ...prev,
      allowedDivisions: prev.allowedDivisions.includes(division)
        ? prev.allowedDivisions.filter(d => d !== division)
        : [...prev.allowedDivisions, division]
    }))
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'supervisor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'user': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 mt-2">Manage user accounts, roles, and permissions</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="cursor-pointer bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update user information and permissions' : 'Create a new user account with appropriate permissions'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value as 'admin' | 'supervisor' | 'user')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Allowed Divisions</Label>
                <div className="space-y-2">
                  {divisions.map(division => (
                    <div key={division} className="flex items-center space-x-2">
                      <Switch
                        id={division}
                        checked={formData.allowedDivisions.includes(division)}
                        onCheckedChange={() => handleDivisionToggle(division)}
                      />
                      <Label htmlFor={division} className="text-sm">{division}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {editingUser && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleResetPassword(editingUser)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Reset Password
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
              </div>
              <Button onClick={handleSubmit} className="cursor-pointer">
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Divisions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <CircleUserRound className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-gray-500">Joined {new Date(user.joinDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {user.emailAddress}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        {user.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.allowedDivisions.slice(0, 2).map(division => (
                          <Badge key={division} variant="outline" className="text-xs">
                            {division}
                          </Badge>
                        ))}
                        {user.allowedDivisions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.allowedDivisions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusBadgeColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'active' ? 'Disable user' : 'Enable user'}
                          className="cursor-pointer"
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4 text-red-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          title="Delete user"
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No users found matching your search criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > itemsPerPage && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className="cursor-pointer"
                    >
                      {number}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={statusConfirmOpen} onOpenChange={setStatusConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusUser?.status === 'active' ? 'Disable User' : 'Enable User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {pendingStatusUser?.status === 'active' ? 'disable' : 'enable'} the user "{pendingStatusUser?.fullName}"?
              {pendingStatusUser?.status === 'active' && (
                <> This will prevent the user from accessing the system.</>
              )}
              {pendingStatusUser?.status === 'disabled' && (
                <> This will restore the user's access to the system.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={pendingStatusUser?.status === 'active' ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'cursor-pointer'}
            >
              {pendingStatusUser?.status === 'active' ? 'Disable' : 'Enable'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the user "{pendingDeleteUser?.fullName}"? 
              This action cannot be undone and will permanently remove all user data including their settings and permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 cursor-pointer">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={resetPasswordConfirmOpen} onOpenChange={setResetPasswordConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the password for "{pendingResetPasswordUser?.fullName}"? 
              A new temporary password will be generated and sent to their email address: {pendingResetPasswordUser?.emailAddress}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword} className="cursor-pointer">
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
      </div>
    </div>
  )
}