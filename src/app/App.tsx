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
                    Quelles sont les alternatives ?
                  </h6>
                  
                  {selectedCommune.taxType === 'TLV' && (
                    <>
                      <p className="mb-4" style={{ color: 'var(--foreground)' }}>
                        Si le logement est occupé comme résidence principale, par vous-même, un locataire, ou à titre gratuit, vous n'êtes pas redevable de cette taxe. Si vous l'occupez comme résidence secondaire, vous serez redevable de la <a href="https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mes-impots-locaux/la-taxe-dhabitation-sur-les-residences-secondaires-comment-ca-marche" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Taxe d'habitation sur les résidences secondaires</a> dès la première année.
                      </p>
                      <p className="mb-4" style={{ color: 'var(--foreground)' }}>
                        Contactez votre mairie ou votre intercommunalité pour connaître les aides locales pour vous accompagner.
                      </p>

                    </>
                  )}
                  
                  {selectedCommune.taxType === 'THLV' && (
                    <>
                      <p className="mb-4" style={{ color: 'var(--foreground)' }}>
                        Si le logement est occupé comme résidence principale, par vous-même, un locataire, ou à titre gratuit, vous n'êtes pas redevable de cette taxe. Si vous l'occupez comme résidence secondaire, vous serez redevable de la <a href="https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mes-impots-locaux/la-taxe-dhabitation-sur-les-residences-secondaires-comment-ca-marche" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Taxe d'habitation sur les résidences secondaires</a> dès la première année.
                      </p>
                      <p className="mb-4" style={{ color: 'var(--foreground)' }}>
                        Pour connaître le taux d'imposition applicable, vous pouvez consulter l'<a href="https://www.data.gouv.fr/datasets/fiscalite-locale-des-particuliers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>open data</a>, ou contacter votre mairie ou votre intercommunalité pour connaître également les aides locales pour vous accompagner.
                      </p>

                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
