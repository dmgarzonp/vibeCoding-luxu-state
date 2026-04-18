import PropertyForm from '../../../components/admin/PropertyForm';
import { getProperty } from '../actions';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data, error } = await getProperty(resolvedParams.id);

  if (error || !data) {
    notFound();
  }

  return (
    <div className="w-full">
      <PropertyForm initialData={data} />
    </div>
  );
}
