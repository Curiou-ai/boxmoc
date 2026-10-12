
'use client';

import React from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * A shipping address form that utilizes Mapbox Address Autofill.
 * Ensures accurate delivery data with an intuitive search experience.
 */
export default function ShippingAddressForm() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Shipping Destination</h3>
        <p className="text-[10px] text-muted-foreground uppercase font-medium">Verify your delivery coordinates</p>
      </div>
      
      <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-muted/50">
        <div className="space-y-2">
          <Label htmlFor="address-line1" className="text-[10px] font-bold uppercase text-muted-foreground">Street Address</Label>
          <AddressAutofill accessToken={token}>
            <Input
              id="address-line1"
              name="address-line1"
              placeholder="Search for your address..."
              type="text"
              autoComplete="shipping address-line1"
              className="bg-background border-muted h-11"
            />
          </AddressAutofill>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address-line2" className="text-[10px] font-bold uppercase text-muted-foreground">Apt, Suite, Floor (Optional)</Label>
          <Input
            id="address-line2"
            name="address-line2"
            placeholder="Suite 101"
            type="text"
            autoComplete="shipping address-line2"
            className="bg-background border-muted h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-[10px] font-bold uppercase text-muted-foreground">City</Label>
            <Input 
              id="city" 
              name="city" 
              autoComplete="shipping address-level2" 
              placeholder="City" 
              className="bg-background border-muted h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-[10px] font-bold uppercase text-muted-foreground">State / Province</Label>
            <Input 
              id="state" 
              name="state" 
              autoComplete="shipping address-level1" 
              placeholder="State" 
              className="bg-background border-muted h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postcode" className="text-[10px] font-bold uppercase text-muted-foreground">ZIP / Postcode</Label>
            <Input 
              id="postcode" 
              name="postcode" 
              autoComplete="shipping postal-code" 
              placeholder="10001" 
              className="bg-background border-muted h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-[10px] font-bold uppercase text-muted-foreground">Country</Label>
            <Input 
              id="country" 
              name="country" 
              autoComplete="shipping country" 
              placeholder="USA" 
              className="bg-background border-muted h-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
