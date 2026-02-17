
'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-context';
import { handleUpdateProfile, handleUpdateProfilePicture, ProfileFormState, ProfilePictureState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

function ProfileSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
        </Button>
    );
}

function PictureSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} size="sm">
             {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
            Change Picture
        </Button>
    );
}

export default function ProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || '');

    const initialProfileState: ProfileFormState = { success: false, message: '' };
    const [profileState, updateProfileAction] = useActionState(handleUpdateProfile, initialProfileState);
    
    const initialPictureState: ProfilePictureState = { success: false, message: '' };
    const [pictureState, updatePictureAction] = useActionState(handleUpdateProfilePicture, initialPictureState);

    useEffect(() => {
        if (profileState.message) {
            toast({
                title: profileState.success ? 'Success' : 'Error',
                description: profileState.message,
                variant: profileState.success ? 'default' : 'destructive',
            });
        }
    }, [profileState, toast]);

    useEffect(() => {
        if (pictureState.message) {
             toast({
                title: pictureState.success ? 'Success' : 'Error',
                description: pictureState.message,
                variant: pictureState.success ? 'default' : 'destructive',
            });
            if(pictureState.success && pictureState.newImageUrl) {
                setAvatarUrl(pictureState.newImageUrl);
            }
        }
    }, [pictureState, toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const formData = new FormData();
            formData.append('profilePicture', event.target.files[0]);
            updatePictureAction(formData);
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold font-headline mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and personal information.</p>
            </div>

            <div className="grid gap-8 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <form action={updateProfileAction}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Full Name</Label>
                                <Input id="displayName" name="displayName" defaultValue={user?.displayName || ''} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" value={user?.email || ''} disabled />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6 justify-end">
                           <ProfileSubmitButton />
                        </CardFooter>
                    </form>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Update your avatar.</CardDescription>
                    </CardHeader>
                    <form action={updatePictureAction}>
                        <CardContent className="flex items-center gap-6">
                             <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarUrl} alt={user?.displayName || 'User'} />
                                <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    accept="image/*"
                                />
                                <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={useFormStatus().pending}>
                                    <Camera className="mr-2 h-4 w-4" />
                                    Upload new picture
                                </Button>
                                <p className="text-xs text-muted-foreground">Recommended: 400x400px, JPG or PNG.</p>
                            </div>
                        </CardContent>
                    </form>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Delete Account</CardTitle>
                        <CardDescription>Permanently delete your account and all associated data. This action cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardFooter className="border-t pt-6 justify-end">
                        <Button variant="destructive">Delete My Account</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
