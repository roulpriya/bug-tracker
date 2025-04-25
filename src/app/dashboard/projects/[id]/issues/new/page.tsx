'use client';

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import { use } from "react";

type Label = {
    id: string;
    name: string;
    color: string;
};

type Params = Promise<{ id: string }>

export default function NewIssuePage(props: { params: Params }) {
    const params = use(props.params)
    const id = params.id;

    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingLabels, setIsLoadingLabels] = useState(true);
    const [error, setError] = useState('');
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#3B82F6');

    // Default blue color

    useEffect(() => {
        fetchLabels();
    }, [id]);

    const fetchLabels = async () => {
        try {
            setIsLoadingLabels(true);
            const response = await fetch(`/api/labels?projectId=${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch labels');
            }

            const data = await response.json();
            if (data.success && data.data) {
                setLabels(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch labels');
            }
        } catch (err) {
            console.error('Error fetching labels:', err);
        } finally {
            setIsLoadingLabels(false);
        }
    };

    const handleCreateLabel = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newLabelName.trim()) {
            return;
        }

        try {
            const response = await fetch('/api/labels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newLabelName,
                    color: newLabelColor,
                    projectId: id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create label');
            }

            const result = await response.json();
            if (result.success && result.data) {
                const newLabel = result.data;
                setLabels([...labels, newLabel]);
                setSelectedLabelIds([...selectedLabelIds, newLabel.id]);
            } else {
                throw new Error(result.message || 'Failed to create label');
            }
            setNewLabelName('');
        } catch (err) {
            console.error('Error creating label:', err);
        }
    };

    const toggleLabel = (labelId: string) => {
        setSelectedLabelIds(prev =>
            prev.includes(labelId)
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Issue title is required');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const response = await fetch('/api/issues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    projectId: id,
                    labelIds: selectedLabelIds,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create issue');
            }

            const result = await response.json();
            if (result.success && result.data) {
                router.push(`/dashboard/issues/${result.data.id}`);
            } else {
                throw new Error(result.message || 'Failed to create issue');
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'An error occurred while creating the issue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Report New Issue</h1>

            <Card className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter issue title"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the issue in detail"
                            rows={5}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Labels
                        </label>

                        {isLoadingLabels ? (
                            <p className="text-sm text-gray-500">Loading labels...</p>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {labels.length === 0 ? (
                                        <p className="text-sm text-gray-500">No labels yet. Create one below.</p>
                                    ) : (
                                        labels.map(label => (
                                            <button
                                                key={label.id}
                                                type="button"
                                                className={`px-3 py-1 text-sm rounded-full transition-all ${
                                                    selectedLabelIds.includes(label.id)
                                                        ? 'ring-2 ring-offset-1'
                                                        : 'opacity-70'
                                                }`}
                                                style={{
                                                    backgroundColor: `${label.color}25`, // 25% opacity
                                                    color: label.color,
                                                    border: `1px solid ${label.color}`
                                                }}
                                                onClick={() => toggleLabel(label.id)}
                                            >
                                                {label.name}
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="mt-3 p-3 border border-gray-200 rounded-md">
                                    <h3 className="text-sm font-medium mb-2">Add New Label</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newLabelName}
                                            onChange={(e) => setNewLabelName(e.target.value)}
                                            className="flex-grow p-2 text-sm border border-gray-300 rounded-md"
                                            placeholder="Label name"
                                        />
                                        <input
                                            type="color"
                                            value={newLabelColor}
                                            onChange={(e) => setNewLabelColor(e.target.value)}
                                            className="p-1 border border-gray-300 rounded-md h-9 w-14"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleCreateLabel}
                                            size="sm"
                                            className="whitespace-nowrap"
                                            disabled={!newLabelName.trim()}
                                        >
                                            Add Label
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 p-2 text-red-700 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="mr-2"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
