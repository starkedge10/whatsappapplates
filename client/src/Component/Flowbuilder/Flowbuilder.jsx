import React, { useState, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useReactFlow,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';

import 'reactflow/dist/style.css';
import Sidebar from './Sidebar.jsx';
import CustomNode from './Nodes/CustomNode.jsx';
import QuestionNodeForm from './Nodes/QuestionNodeForm.jsx';
import MessageNodeForm from './Nodes/MessageNodeForm.jsx';
import TemplateNodeFrom from './Nodes/TemplateNodeFrom.jsx';
import DeleteEdgeModel from './DeleteEdgeModel.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ChatbotNamePopup from './ChatbotNamePopup.jsx';

import { getChatbots, updateChatbot } from '../../redux/Chatbot/chatbotsThunk.js';




const nodeTypes = {
    custom: CustomNode,
};

function FlowCanvas({ chatbot, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, setEditNode }) {
    const { getViewport } = useReactFlow();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleAddNode = (label, subType) => {
        const id = `${subType}-${Date.now()}`;
        const viewport = getViewport();

        const randomOffsetX = Math.floor(Math.random() * 200);
        const randomOffsetY = Math.floor(Math.random() * 300);

        const position = {
            x: -viewport.x / viewport.zoom + 300 + randomOffsetX,
            y: -viewport.y / viewport.zoom + 200 + randomOffsetY,
        };

        const newNode = {
            id,
            type: 'custom',
            position,
            data: {
                id,
                label,
                subType,
                content: {},
                setNodes,
                setEditNode,
            },
        };

        setNodes((nds) => [...nds, newNode]);
    };


    const [edgeToDelete, setEdgeToDelete] = useState(null);

    const onConnect = React.useCallback(
        (params) => {
            const edge = {
                ...params,
                animated: true,
                style: { stroke: '#7C7D7D', strokeWidth: 3 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#00A63E',
                },
            };

            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    const handleConfirmDeleteEdge = () => {
        setEdges((eds) => eds.filter((e) => e.id !== edgeToDelete.id));
        setEdgeToDelete(null);
    };

    const onEdgeClick = React.useCallback((event, edge) => {
        event.stopPropagation();
        setEdgeToDelete(edge);
    }, []);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSaveChatbotFlow = () => {
        toast.promise(
            dispatch(updateChatbot({ id: chatbot._id, flow: { nodes, edges }, })),
            {
                pending: 'updating chatbot...',
                success: 'Chatbot updated successfully!',
                error: 'Failed to update chatbot',
            }
        );

        navigate('/chatbot');

    };

    const [namePopup, setNamePopup] = useState(false);
    const handleNamePopup = () => {
        setNamePopup(!namePopup);
    }

    const handleNamePopupClose = () => {
        setNamePopup(false);
    }



    return (
        <>
            <div className="flex-1 h-[calc(100vh-125px)]">
                <div className="px-[20px] py-4 flex items-center justify-between mr-4">
                    <div className="flex gap-6 items-center ">
                        <button
                            type="button"
                            className="px-4 py-1 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-1 rounded-md bg-green-600 cursor-pointer hover:bg-green-700 text-white" onClick={handleSaveChatbotFlow}>
                            Save
                        </button>
                    </div>

                    <div className='flex gap-4 items-center'>
                        <h4 className='font-semibold'>{chatbot.name}</h4>
                        <i className="fa-solid text-sm fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer " onClick={handleNamePopup}></i>
                    </div>
                </div>

                {namePopup && (
                    <ChatbotNamePopup onClose={handleNamePopupClose}
                        chatbotId={chatbot._id}
                        initialName={chatbot.name} />
                )}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
                    onEdgeClick={onEdgeClick}
                    fitView
                    className="top-[0px] bg-gray-50"
                >
                    <MiniMap
                        nodeColor={(node) => {
                            const type = node.data?.subType;
                            switch (type) {
                                case 'question':
                                    return '#F79431';
                                case 'message':
                                    return '#E25866';
                                case 'template':
                                    return '#6C7ED6';
                                default:
                                    return '#ccc';
                            }
                        }}
                        nodeStrokeColor={() => '#333'}
                        zoomable={true}
                        zoomStep={0.5}
                        pannable={true}
                        className="cursor-pointer"
                    />
                    <Controls />
                    <Background variant="lines" gap={80} size={20} color="#EEF0F6" />
                </ReactFlow>
            </div>

            <Sidebar onAddNode={handleAddNode} />

            <DeleteEdgeModel open={!!edgeToDelete} onClose={() => setEdgeToDelete(null)} onConfirm={handleConfirmDeleteEdge} />
        </>
    );
}

function Flowbuilder() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const chatbotId = location.state?.chatbotId;
    console.log(chatbotId)



    const chatbot = useSelector((state) =>
        state.chatbots.chatbots.find((bot) => String(bot._id) === String(chatbotId))
    );



    console.log(chatbot);



    useEffect(() => {
        if (chatbot.length == 0) {
            dispatch(getChatbots())
        }
    }, [])






    if (!chatbotId) {
        return (
            <div className="p-4 text-center text-red-600">
                Chatbot ID not provided. Please access this page correctly.
            </div>
        );
    }

    if (!chatbot) {
        return (
            <div className="p-4 text-center text-red-600">
                Chatbot not found. Please select a valid chatbot.
            </div>
        );
    }


    const [edges, setEdges, onEdgesChange] = useEdgesState(chatbot.flow?.edges || []);

    const [nodes, setNodes, onNodesChange] = useNodesState(chatbot.flow?.nodes || []);
    const [editNode, setEditNode] = useState(null);

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    setNodes,
                    setEditNode,
                },
            }))
        );
    }, [setNodes, setEditNode]);



    console.log(nodes)

    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            ...newData,
                        },
                    }
                    : node
            )
        );
    };

    const onFlowChange = React.useCallback(
        ({ nodes, edges }) => {

            dispatch(updateChatbot({ id: chatbot._id, flow: { nodes, edges }, }))

        }, [dispatch, chatbot.id]);


    const handleNodesChange = (changes) => {
        const updatedNodes = applyNodeChanges(changes, nodes);
        setNodes(updatedNodes);
        onFlowChange({ nodes: updatedNodes, edges });
    };

    const handleEdgesChange = (changes) => {
        const updatedEdges = applyEdgeChanges(changes, edges);
        setEdges(updatedEdges);
        onFlowChange({ nodes, edges: updatedEdges });
    };

    return (
        <ReactFlowProvider>
            <div className="flex h-[calc(100vh-100px)]">
                <FlowCanvas
                    chatbot={chatbot}
                    nodes={nodes}
                    setNodes={setNodes}
                    onNodesChange={handleNodesChange}
                    edges={edges}
                    setEdges={setEdges}
                    onEdgesChange={handleEdgesChange}
                    setEditNode={setEditNode}
                />
            </div>

            {editNode?.data?.subType === 'question' && <QuestionNodeForm node={editNode} onClose={() => setEditNode(null)} updateNodeData={updateNodeData} />}

            {editNode?.data?.subType === 'message' && (
                <MessageNodeForm node={editNode} onClose={() => setEditNode(null)} updateNodeData={updateNodeData} />
            )}

            {editNode?.data?.subType === 'template' && (
                <TemplateNodeFrom node={editNode} onClose={() => setEditNode(null)} updateNodeData={updateNodeData} />
            )}
        </ReactFlowProvider>
    );
}

export default Flowbuilder;
