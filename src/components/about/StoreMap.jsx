const stores = [
  {
    name: "FITFLOOR Mumbai",
    address: "Phoenix Palladium, Lower Parel, Mumbai 400013",
    phone: "+91 22 5555 0123",
    hours: "Mon-Sat: 11AM-9PM",
    lat: 18.995,
    lng: 72.825
  },
  {
    name: "FITFLOOR Delhi",
    // Fixed: Removed trailing comma
    address: "DLF Emporio, Vasant Kunj, New Delhi 110070",
    phone: "+91 11 5555 0456",
    hours: "Mon-Sat: 11AM-9PM",
    lat: 28.543,
    lng: 77.157
  },
  {
    name: "FITFLOOR Bangalore",
    address: "UB City, Vittal Mallya Road, Bengaluru 560001",
    // Fixed: Removed trailing comma
    phone: "+91 80 5555 0789",
    hours: "Mon-Sat: 10:30AM-9PM",
    lat: 12.971,
    lng: 77.594
  }
];
const StoreMap = () => {
  return <div className="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted/10 relative">
      {
    /* Static Map using Google Maps Embed API */
  }
      <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.116099146!2d72.74109995!3d19.08219785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="w-full h-full"
  />

      {
    /* Overlay with store markers */
  }
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h4 className="text-sm font-medium text-foreground mb-3">Our Locations</h4>
        <div className="space-y-2">
          {stores.map((store, index) => <div key={index} className="text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="font-medium text-foreground">{store.name}</span>
              </div>
              <p className="text-muted-foreground ml-4">{store.address}</p>
            </div>)}
        </div>
      </div>
    </div>;
};
var stdin_default = StoreMap;
export {
  stdin_default as default
};
