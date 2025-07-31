import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import PropertyGrid from './components/PropertyGrid';
import PropertyDetail from './components/PropertyDetail';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<number | null>(null);
  const [filters, setFilters] = React.useState<any>({});

  const handlePropertyClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
  };

  const handleClosePropertyDetail = () => {
    setSelectedPropertyId(null);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Hero />
        <Filters onFilterChange={setFilters} />
        <PropertyGrid onPropertyClick={handlePropertyClick} filters={filters} />
        <Features />
        <Footer />
        
        {selectedPropertyId && (
          <PropertyDetail
            propertyId={selectedPropertyId}
            isOpen={!!selectedPropertyId}
            onClose={handleClosePropertyDetail}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;