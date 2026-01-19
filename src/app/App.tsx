import { useState } from 'react';
import { SearchBar } from '@/app/components/SearchBar';
import { Callout } from '@/app/components/Callout';
import { communes, CommuneData } from '@/data/communes';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [selectedCommune, setSelectedCommune] = useState<CommuneData | null>(null);

  const handleSelectCommune = (commune: CommuneData) => {
    setSelectedCommune(commune);
  };

  const getTaxInfo = () => {
    if (!selectedCommune) return null;

    switch (selectedCommune.taxType) {
      case 'TLV':
        return {
          type: 'warning' as const,
          title: `Votre logement vacant est soumis à la Taxe sur les Logements Vacants (TLV)`,
          message: `La commune de ${selectedCommune.name} est située en zone tendue. Si votre logement est vacant depuis plus d'un an, vous êtes redevable de la TLV. Le taux est de 17% la première année, puis 34% les années suivantes.`
        };
      case 'THLV':
        return {
          type: 'warning' as const,
          title: `Votre logement vacant est soumis à la Taxe d'Habitation sur les Logements Vacants (THLV)`,
          message: `La commune de ${selectedCommune.name} a instauré la THLV. Si votre logement est vacant depuis plus de deux ans, vous êtes redevable de cette taxe. Le taux est fixé par délibération de la commune (entre 12,5% et 25% de la valeur locative).`
        };
      case 'NONE':
        return {
          type: 'success' as const,
          title: `Votre logement vacant n'est pas soumis à une taxe spécifique`,
          message: `La commune de ${selectedCommune.name} n'est pas concernée par la TLV ni par la THLV. Vous n'êtes donc pas redevable d'une taxe spécifique sur les logements vacants.`
        };
    }
  };

  const taxInfo = getTaxInfo();

  return (
    <div 
      className="min-h-screen p-6 md:p-8"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-3xl mx-auto">
        <main>
          <SearchBar 
            onSelectCommune={handleSelectCommune}
            communes={communes}
          />

          {selectedCommune && taxInfo && (
            <>
              <Callout
                type={taxInfo.type}
                title={taxInfo.title}
                message={taxInfo.message}
              />

              {selectedCommune.taxType !== 'NONE' && (
                <div className="mt-6 p-4 border" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>
                  <h6 
                    className="mb-3"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      lineHeight: '1.5'
                    }}
                  >
                    Conditions d'application de la {selectedCommune.taxType}
                  </h6>
                  
                  <ul className="list-disc list-inside space-y-2 mb-6" style={{ color: 'var(--foreground)' }}>
                    {selectedCommune.taxType === 'TLV' && (
                      <>
                        <li>Le logement doit être vacant depuis au moins 1 an au 1er janvier de l'année d'imposition</li>
                        <li>La taxe s'applique dans les zones tendues définies par décret</li>
                        <li>Taux : 17% la première année, puis 34% les années suivantes de la valeur locative</li>
                      </>
                    )}
                    {selectedCommune.taxType === 'THLV' && (
                      <>
                        <li>Le logement doit être vacant depuis au moins 2 ans au 1er janvier de l'année d'imposition</li>
                        <li>La taxe est instituée par délibération de la commune ou de l'EPCI</li>
                        <li>Taux : entre 12,5% et 25% de la valeur locative (fixé par la collectivité)</li>
                        <li>La THLV ne s'applique pas dans les zones soumises à la TLV</li>
                      </>
                    )}
                  </ul>
                  
                  <h6 
                    className="mb-2"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      lineHeight: '1.5'
                    }}
                  >
                    Comment éviter la {selectedCommune.taxType} ?
                  </h6>
                  <p className="mb-4" style={{ color: 'var(--foreground)' }}>
                    Pour éviter cette taxe, vous devez occuper le logement comme résidence principale, le louer, ou le mettre à disposition gratuitement. Contactez votre mairie pour connaître le taux applicable et les éventuelles exonérations locales.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.service-public.fr/particuliers/vosdroits/F31922"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        borderRadius: 'var(--radius)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      En savoir plus sur Service-Public.fr
                    </a>
                    <a
                      href="https://www.impots.gouv.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border hover:opacity-70 transition-opacity"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--primary)',
                        borderColor: 'var(--border)',
                        borderRadius: 'var(--radius)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      Consulter mon espace impots.gouv.fr
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
