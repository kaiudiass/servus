import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Copy, Bell, Calendar, AlertCircle, Clock, Pencil, Trash2, Users, Eye, X, Shield, User as UserIcon, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { useScale } from '../../contexts/ScaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotice } from '../../contexts/NoticeContext';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { MultiSelect } from '../../components/MultiSelect';
import { Pagination } from '../../components/Pagination';
import styles from './Admin.module.css';

const CULT_DAYS = [
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
  { value: 'quarta', label: 'Quarta-feira' },
];

export function Admin() {
  const { 
    scales, sectors, users, 
    createScale, copyScale, updateScale, deleteScale, updateScaleSector, 
    createSector, deleteSector, updateSector, updateSectorMembers,
    updateUser, deleteUser
  } = useScale();
  const { user: currentUser } = useAuth();
  const { notices, createNotice, deleteNotice, getActiveNotices, updateNotice } = useNotice();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showScaleModal, setShowScaleModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showEditSectorModal, setShowEditSectorModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditNoticeModal, setShowEditNoticeModal] = useState(false);
  const [showSectorMembersModal, setShowSectorMembersModal] = useState(false);
  const [selectedScale, setSelectedScale] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [tab, setTab] = useState(searchParams.get('tab') || 'escalas');
  const [scalesSubTab, setScalesSubTab] = useState('proximas'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRoleSelect, setActiveRoleSelect] = useState(null);
  const [sectorForm, setSectorForm] = useState({ name: '', description: '' });
  const [sectorEditForm, setSectorEditForm] = useState({ id: '', name: '', description: '', memberIds: [] });
  const [userEditForm, setUserEditForm] = useState({ id: '', name: '', email: '', phone: '', password: '', role: 'user', sectors: [] });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const editingSectorId = searchParams.get('edit');
  const editingUserId = searchParams.get('editUser');

  useEffect(() => {
    if (editingUserId) {
      const user = users.find(u => u.id === editingUserId);
      if (user) {
        setUserEditForm({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          phone: user.phone || '',
          password: '',
          sectors: user.sectors || []
        });
      }
    }
  }, [editingUserId, users]);

  const handleEditUser = (e, user) => {
    e.stopPropagation();
    setSearchParams({ tab: 'usuarios', editUser: user.id });
  };

  const handleCloseEditUser = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('editUser');
    setSearchParams(params);
    setUserEditForm({ id: '', name: '', email: '', role: 'user', sectors: [] });
  };

  const handleUpdateUser = async () => {
    if (!userEditForm.name || !userEditForm.email) return;
    await updateUser(userEditForm.id, {
      name: userEditForm.name,
      email: userEditForm.email,
      phone: userEditForm.phone,
      role: userEditForm.role,
      password: userEditForm.password || undefined,
      sectorIds: userEditForm.sectors
    });
    handleCloseEditUser();
  };

  const handleDeleteUser = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Excluir este usuário permanentemente?')) {
      await deleteUser(id);
    }
  };

  useEffect(() => {
    if (editingSectorId) {
      const sector = sectors.find(s => s.id === editingSectorId);
      if (sector) {
        setSectorEditForm({
          id: sector.id,
          name: sector.name,
          description: sector.description || '',
          memberIds: (users || []).filter(u => u.sectors?.includes(sector.id)).map(u => u.id)
        });
      }
    }
  }, [editingSectorId, sectors, users]);


  useEffect(() => {
    const activeTab = searchParams.get('tab');
    if (activeTab) {
      setTab(activeTab);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, scalesSubTab, searchTerm]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const getDayFromDate = (dateStr) => {
    if (!dateStr) return 'domingo';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return days[date.getDay()];
  };

  const [scaleForm, setScaleForm] = useState({
    date: '',
    day: 'domingo',
    time: '19:00',
    obs: '',
    sectors: {},
  });

  const [copyForm, setCopyForm] = useState({
    sourceId: '',
    newDate: '',
    newDay: 'quarta',
  });

  const [noticeForm, setNoticeForm] = useState({ title: '', description: '', date: '', priority: 'normal', sectors: [] });


  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleCreateScale = async () => {
    if (!scaleForm.date) return;

    const today = new Date().toISOString().split('T')[0];
    if (scaleForm.date < today) {
      alert('Não é possível criar escalas em datas que já passaram.');
      return;
    }

    const finalSectors = sectors.reduce((acc, s) => {
      acc[s.id] = scaleForm.sectors[s.id] || [];
      return acc;
    }, {});

    await createScale({
      ...scaleForm,
      sectors: finalSectors,
    });
    setShowScaleModal(false);
    setScaleForm({ date: '', day: 'domingo', time: '19:00', obs: '', sectors: {} });
  };

  const handleCopyScale = async () => {
    if (!copyForm.sourceId || !copyForm.newDate) return;
    await copyScale(copyForm.sourceId, copyForm.newDate, copyForm.newDay);
    setShowCopyModal(false);
    setCopyForm({ sourceId: '', newDate: '', newDay: 'quarta' });
  };

  const handleDeleteScale = async (id) => {
    if (window.confirm('Excluir esta escala?')) {
      await deleteScale(id);
      setShowDetailModal(false);
      setSelectedScale(null);
    }
  };

  const handleViewScale = (scale) => {
    setSelectedScale(scale);
    setShowDetailModal(true);
  };

  const handleEditScale = () => {
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleUpdateScale = async () => {
    if (!selectedScale) return;
    await updateScale(selectedScale.id, {
      date: selectedScale.date,
      day: selectedScale.day,
      time: selectedScale.time,
      obs: selectedScale.obs,
      sectors: selectedScale.sectors,
    });
    setShowEditModal(false);
    setSelectedScale(null);
  };

  const handleUpdateScaleSectorLocally = (sectorId, selectedIds) => {
    if (!selectedScale) return;
    const names = selectedIds.map(id => users.find(u => u.id === id)?.name).filter(Boolean);
    setSelectedScale(prev => ({
      ...prev,
      sectors: { ...prev.sectors, [sectorId]: names },
    }));
  };

  const handleCreateNotice = async () => {
    if (!noticeForm.title || !noticeForm.date) return;
    await createNotice({
      ...noticeForm,
      sectorIds: noticeForm.sectors
    });
    setShowNoticeModal(false);
    setNoticeForm({ title: '', description: '', date: '', priority: 'normal', sectors: [] });
  };

  const handleDeleteNotice = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Excluir este aviso?')) {
      await deleteNotice(id);
    }
  };

  const handleEditNotice = (e, notice) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setNoticeForm({
      title: notice.title,
      description: notice.description,
      date: notice.date,
      priority: notice.priority,
      sectors: notice.sectors || []
    });
    setShowEditNoticeModal(true);
  };

  const handleUpdateNotice = async () => {
    if (!noticeForm.title || !noticeForm.date) return;
    await updateNotice(selectedNotice.id, {
      ...noticeForm,
      sectorIds: noticeForm.sectors
    });
    setShowEditNoticeModal(false);
    setSelectedNotice(null);
    setNoticeForm({ title: '', description: '', date: '', priority: 'normal', sectors: [] });
  };

  const handleCreateSector = async () => {
    if (!sectorForm.name) return;
    await createSector(sectorForm);
    setShowSectorModal(false);
    setSectorForm({ name: '', description: '' });
  };

  const handleEditSector = (e, sector) => {
    e.stopPropagation();
    setSearchParams({ tab: 'setores', edit: sector.id });
  };

  const handleCloseEdit = () => {
    setSearchParams({ tab: 'setores' });
    setSectorEditForm({ id: '', name: '', description: '', memberIds: [] });
  };

  const handleUpdateSector = async () => {
    if (!sectorEditForm.name) return;
    await updateSector(sectorEditForm.id, {
      name: sectorEditForm.name,
      description: sectorEditForm.description
    });
    await updateSectorMembers(sectorEditForm.id, sectorEditForm.memberIds);
    handleCloseEdit();
  };

  const handleDeleteSector = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Excluir este setor?')) {
      await deleteSector(id);
    }
  };

  const getUsersBySector = (sectorId) => {
    if (!users || !sectorId) return [];
    return users.filter(u => u.sectors && Array.isArray(u.sectors) && u.sectors.includes(sectorId));
  };

  const getSelectedUsersBySector = (sectorId, currentNames) => {
    return users
      .filter(u => currentNames.includes(u.name))
      .map(u => u.id);
  };

  const filteredScales = scales
    .filter(scale => {
      const isFuture = scale.date >= new Date().toISOString().split('T')[0];
      if (scalesSubTab === 'proximas') return isFuture;
      if (scalesSubTab === 'historico') return !isFuture;
      return true;
    })
    .filter(scale => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      const hasMember = Object.values(scale.sectors).some(names =>
        names.some(name => name.toLowerCase().includes(search))
      );
      return scale.day.toLowerCase().includes(search) || hasMember;
    });

  const paginatedScales = filteredScales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedSectors = sectors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeNotices = getActiveNotices();

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'escalas' ? styles.active : ''}`}
          onClick={() => handleTabChange('escalas')}
        >
          <Calendar size={18} />
          Escalas
        </button>
        <button
          className={`${styles.tab} ${tab === 'avisos' ? styles.active : ''}`}
          onClick={() => handleTabChange('avisos')}
        >
          <Bell size={18} />
          Avisos
          {activeNotices.length > 0 && <span className={styles.badge}>{activeNotices.length}</span>}
        </button>
        <button
          className={`${styles.tab} ${tab === 'setores' ? styles.active : ''}`}
          onClick={() => handleTabChange('setores')}
        >
          <Users size={18} />
          Setores
        </button>
        <button
          className={`${styles.tab} ${tab === 'usuarios' ? styles.active : ''}`}
          onClick={() => handleTabChange('usuarios')}
        >
          <UserIcon size={18} />
          Usuários
        </button>
      </div>

      {tab === 'escalas' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.subTabs}>
              <button
                className={`${styles.subTab} ${scalesSubTab === 'proximas' ? styles.active : ''}`}
                onClick={() => setScalesSubTab('proximas')}
              >
                Próximas
              </button>
              <button
                className={`${styles.subTab} ${scalesSubTab === 'historico' ? styles.active : ''}`}
                onClick={() => setScalesSubTab('historico')}
              >
                Histórico
              </button>
            </div>
          </div>

          {scalesSubTab === 'proximas' && (
            <div className={styles.actions}>
              <Button onClick={() => setShowScaleModal(true)}>
                <Plus size={18} />
                Nova Escala
              </Button>
              <Button variant="secondary" onClick={() => setShowCopyModal(true)}>
                <Copy size={18} />
                Copiar Escala
              </Button>
            </div>
          )}

          <div className={styles.grid}>
            {paginatedScales.map(scale => (
              <div
                key={scale.id}
                className={styles.scaleCard}
                onClick={() => handleViewScale(scale)}
              >
                <div className={styles.scaleHeader}>
                  <div className={styles.scaleDateInfo}>
                    <span className={styles.scaleDay}>{scale.day}</span>
                    <span className={styles.scaleDate}>{formatDate(scale.date)}</span>
                  </div>
                  <div className={styles.scaleTime}>
                    <Clock size={14} />
                    {scale.time}
                  </div>
                </div>
                {scale.obs && <div className={styles.scaleObs}>{scale.obs}</div>}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredScales.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {tab === 'avisos' && (
        <div className={styles.content}>
          <div className={styles.actions}>
            <Button onClick={() => setShowNoticeModal(true)}>
              <Plus size={18} />
              Novo Aviso
            </Button>
          </div>

          <div className={styles.grid}>
            {paginatedNotices.map(notice => (
              <div key={notice.id} className={`${styles.noticeCard} ${styles[notice.priority]}`}>
                <div className={styles.noticeHeader}>
                  <div className={styles.noticeInfo}>
                    <span className={styles.noticeTitle}>{notice.title}</span>
                    <span className={styles.noticeDate}>{formatDate(notice.date)}</span>
                    <div className={styles.noticeTags}>
                      {notice.sectors?.includes('all') ? (
                        <span className={styles.sectorSmallTag} style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary)' }}>
                          Todos os Setores
                        </span>
                      ) : (
                        <>
                          {notice.sectors?.slice(0, 2).map(sId => {
                            const s = sectors.find(sect => sect.id === sId);
                            return s ? <span key={sId} className={styles.sectorSmallTag}>{s.name}</span> : null;
                          })}
                          {notice.sectors?.length > 2 && <span className={styles.tagEllipsis}>...</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {notice.description && <p className={styles.noticeDescTruncated}>{notice.description}</p>}
                
                <div className={styles.noticeFooter}>
                  <button className={styles.iconBtn} onClick={(e) => handleEditNotice(e, notice)}>
                    <Pencil size={16} />
                  </button>
                  <button className={styles.iconBtn} onClick={(e) => handleDeleteNotice(e, notice.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={notices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {tab === 'setores' && (
        <div className={styles.content}>
          {editingSectorId ? (
            <div className={styles.editSectorSection}>
              <div className={styles.sectionHeader}>
                <button className={styles.backBtn} onClick={handleCloseEdit}>
                  <ArrowLeft size={20} />
                  <span>Voltar</span>
                </button>
                <div className={styles.headerActions}>
                  <Button onClick={handleUpdateSector}>Salvar Alterações</Button>
                </div>
              </div>

              <div className={styles.editLayout}>
                <div className={styles.editFields}>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Dados Básicos</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Nome do Setor"
                        value={sectorEditForm.name}
                        onChange={(e) => setSectorEditForm({ ...sectorEditForm, name: e.target.value })}
                      />
                      <Input
                        label="Descrição"
                        value={sectorEditForm.description}
                        onChange={(e) => setSectorEditForm({ ...sectorEditForm, description: e.target.value })}
                        multiline={true}
                      />
                    </div>
                  </div>

                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Adicionar Voluntários</h3>
                    </div>
                    <div className={styles.addMemberWrapper}>
                      <MultiSelect
                        options={users
                          .filter(u => !sectorEditForm.memberIds.includes(u.id))
                          .map(u => ({ id: u.id, name: u.name }))
                        }
                        selected={[]}
                        onChange={(ids) => setSectorEditForm({ 
                          ...sectorEditForm, 
                          memberIds: [...sectorEditForm.memberIds, ...ids] 
                        })}
                        placeholder="Buscar voluntários para adicionar..."
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.membersListSide}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Voluntários do Setor</h3>
                      <span className={styles.badge}>{sectorEditForm.memberIds.length}</span>
                    </div>
                    <div className={styles.membersGrid}>
                      {sectorEditForm.memberIds.length > 0 ? (
                        sectorEditForm.memberIds.map(userId => {
                          const user = users.find(u => u.id === userId);
                          if (!user) return null;
                          return (
                            <div key={user.id} className={styles.memberCard}>
                              <div className={styles.memberInfo}>
                                <span className={styles.memberName}>{user.name}</span>
                                <span className={styles.memberEmail}>{user.email}</span>
                              </div>
                              <button 
                                className={styles.removeBtn}
                                onClick={() => setSectorEditForm({
                                  ...sectorEditForm,
                                  memberIds: sectorEditForm.memberIds.filter(id => id !== user.id)
                                })}
                                title="Remover voluntário"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className={styles.emptyState}>
                          <Users size={32} />
                          <p>Nenhum voluntário vinculado.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.actions}>
                <Button onClick={() => setShowSectorModal(true)}>
                  <Plus size={18} />
                  Novo Setor
                </Button>
              </div>

              <div className={styles.grid}>
                {paginatedSectors.map(sector => (
                  <div
                    key={sector.id}
                    className={styles.sectorCard}
                    onClick={(e) => handleEditSector(e, sector)}
                  >
                    <div className={styles.sectorCardHeader}>
                      <span className={styles.sectorName}>{sector.name}</span>
                    </div>
                    <div className={styles.sectorInfo}>
                      {sector.description && <p className={styles.sectorDesc}>{sector.description}</p>}
                      <div className={styles.sectorFooter}>
                        <span className={styles.sectorCount}>
                          <Users size={12} />
                          {getUsersBySector(sector.id).length} membros
                        </span>
                        <div className={styles.sectorActionsBottom}>
                          <button className={styles.iconBtn} onClick={(e) => handleEditSector(e, sector)} title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={(e) => handleDeleteSector(e, sector.id)} title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={sectors.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      )}

      {tab === 'usuarios' && (
        <div className={styles.content}>
          {editingUserId ? (
            <div className={styles.editSectorSection}>
              <div className={styles.sectionHeader}>
                <button className={styles.backBtn} onClick={handleCloseEditUser}>
                  <ArrowLeft size={20} />
                  <span>Voltar</span>
                </button>
                <div className={styles.headerActions}>
                  <Button onClick={handleUpdateUser}>Salvar Perfil</Button>
                </div>
              </div>

              <div className={styles.editLayout}>
                <div className={styles.editFields}>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Dados do Perfil</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Nome Completo"
                        value={userEditForm.name}
                        onChange={(e) => setUserEditForm({ ...userEditForm, name: e.target.value })}
                      />
                      <Input
                        label="E-mail"
                        value={userEditForm.email}
                        onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                      />
                      <Input
                        label="Telefone"
                        value={userEditForm.phone}
                        onChange={(e) => setUserEditForm({ ...userEditForm, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                      />
                      <Input
                        label="Nova Senha (deixe em branco para não alterar)"
                        type="password"
                        placeholder="Digite a nova senha..."
                        value={userEditForm.password}
                        onChange={(e) => setUserEditForm({ ...userEditForm, password: e.target.value })}
                      />
                      {userEditForm.role !== 'master' && userEditForm.id !== currentUser?.id && (
                        <div className={styles.fieldWrapper}>
                          <label className={styles.fieldLabel}>Cargo / Nível de Acesso</label>
                          <div className={styles.roleGridCompact}>
                            <button
                              className={`${styles.roleOptionCompact} ${userEditForm.role === 'user' ? styles.active : ''}`}
                              onClick={() => setUserEditForm({ ...userEditForm, role: 'user' })}
                            >
                              <UserIcon size={16} />
                              <span>Usuário</span>
                            </button>
                            <button
                              className={`${styles.roleOptionCompact} ${userEditForm.role === 'admin' ? styles.active : ''}`}
                              onClick={() => setUserEditForm({ ...userEditForm, role: 'admin' })}
                            >
                              <Shield size={16} />
                              <span>Administrador</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.membersListSide}>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Setores Vinculados</h3>
                    <div className={styles.addMemberWrapper} style={{ marginTop: '16px' }}>
                      <MultiSelect
                        options={sectors.map(s => ({ id: s.id, name: s.name }))}
                        selected={userEditForm.sectors}
                        onChange={(ids) => setUserEditForm({ ...userEditForm, sectors: ids })}
                        placeholder="Selecione os setores..."
                      />
                    </div>
                    <p className={styles.helpText}>O voluntário aparecerá para escalação nos setores selecionados.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.searchWrapper}>
                <Input
                  placeholder="Pesquisar usuário por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </div>
              <div className={styles.grid}>
                {paginatedUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={styles.userCard}
                    onClick={(e) => handleEditUser(e, user)}
                  >
                    <div className={styles.userCardHeader}>
                      <div className={styles.userMainInfo}>
                        <div className={styles.userAvatar}>
                          <UserIcon size={20} />
                        </div>
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>{user.name.split(' ').slice(0, 2).join(' ')}</span>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                      </div>
                      <div className={styles.sectorActions}>
                        <button 
                          className={styles.iconBtn} 
                          onClick={(e) => handleEditUser(e, user)} 
                          title="Editar Perfil"
                          disabled={user.role === 'master' && user.id !== currentUser?.id}
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          className={`${styles.iconBtn} ${styles.danger}`} 
                          onClick={(e) => handleDeleteUser(e, user.id)} 
                          title="Excluir Usuário"
                          disabled={user.role === 'master' && user.id !== currentUser?.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.userCardFooter}>
                      <div className={styles.userTags}>
                        {user.sectors && user.sectors.length > 0 ? (
                          <>
                            {user.sectors.slice(0, 3).map(sectorId => {
                              const sector = sectors.find(s => s.id === sectorId);
                              return sector ? <span key={sectorId} className={styles.userTag}>{sector.name}</span> : null;
                            })}
                            {user.sectors.length > 3 && <span className={styles.userTagMore}>...</span>}
                          </>
                        ) : (
                          <span className={styles.noSectors}>Sem setores</span>
                        )}
                      </div>
                      <div className={styles.userRoleBadge}>
                        {user.role === 'master' ? (
                          <div className={styles.masterBadge}>
                            <Shield size={12} fill="currentColor" />
                            <span>MASTER</span>
                          </div>
                        ) : user.role === 'admin' ? (
                          <Shield size={12} />
                        ) : (
                          <UserIcon size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      )}

      <Modal isOpen={showScaleModal} onClose={() => setShowScaleModal(false)} title="Nova Escala" size="lg">
        <div className={styles.detailHeader}>
          <div className={styles.detailDateInfo}>
            <span className={styles.detailDay}>
              {CULT_DAYS.find(d => d.value === scaleForm.day)?.label || scaleForm.day}
            </span>
            <span className={styles.detailDate}>{scaleForm.date.split('-').reverse().join('/') || 'Selecione uma data'}</span>
            <span className={styles.detailTime}>
              <Clock size={14} />
              {scaleForm.time}
            </span>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.timeObsRow}>
            <Input
              type="date"
              label="Data do Culto"
              min={new Date().toISOString().split('T')[0]}
              value={scaleForm.date}
              onChange={e => {
                const date = e.target.value;
                setScaleForm(p => ({ ...p, date, day: getDayFromDate(date) }));
              }}
              fullWidth
              error={scaleForm.date && scaleForm.date < new Date().toISOString().split('T')[0] ? "Não é possível criar escalas para datas passadas" : ""}
            />
            <Input
              type="time"
              label="Horário"
              value={scaleForm.time}
              onChange={e => setScaleForm(p => ({ ...p, time: e.target.value }))}
              fullWidth
            />
          </div>
          
          <div className={styles.obsFieldRow}>
            <Input
              label="Observação"
              placeholder="Ex: Chegar 18h30"
              value={scaleForm.obs}
              onChange={e => setScaleForm(p => ({ ...p, obs: e.target.value }))}
              fullWidth
            />
          </div>
          
          <div className={styles.sectorsGrid}>
            <h3 className={styles.gridTitle}>Escalar Equipes</h3>
            {sectors.map(sector => (
              <div key={sector.id} className={styles.sectorEditCard}>
                <span className={styles.sectorEditName}>
                  <Users size={12} />
                  {sector.name}
                </span>
                <MultiSelect
                  options={getUsersBySector(sector.id)}
                  selected={getSelectedUsersBySector(sector.id, scaleForm.sectors[sector.id] || [])}
                  onChange={(selectedIds) => {
                    const names = selectedIds.map(id => users.find(u => u.id === id)?.name).filter(Boolean);
                    setScaleForm(p => ({
                      ...p,
                      sectors: { ...p.sectors, [sector.id]: names }
                    }));
                  }}
                  placeholder="Selecione..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={() => setShowScaleModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateScale} 
            disabled={!scaleForm.date || scaleForm.date < new Date().toISOString().split('T')[0]}
          >
            Criar Escala
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showCopyModal} onClose={() => setShowCopyModal(false)} title="Copiar Escala" size="md">
        <p className={styles.copyInfo}>Copie uma escala existente para outra data</p>
        <div className={styles.formGrid}>
          <div className={styles.selectWrapper}>
            <label className={styles.selectLabel}>Escala de origem</label>
            <select
              className={styles.select}
              value={copyForm.sourceId}
              onChange={e => setCopyForm(p => ({ ...p, sourceId: e.target.value }))}
            >
              <option value="">Selecione...</option>
              {scales.map(s => (
                <option key={s.id} value={s.id}>
                  {s.day} - {s.date} ({s.time})
                </option>
              ))}
            </select>
          </div>
          <Input
            type="date"
            label="Nova data"
            value={copyForm.newDate}
            onChange={e => {
              const date = e.target.value;
              setCopyForm(p => ({ ...p, newDate: date, newDay: getDayFromDate(date) }));
            }}
            fullWidth
          />
          <div className={styles.autoDayInfo}>
            <Calendar size={14} />
            <span>Dia: <strong>{CULT_DAYS.find(d => d.value === copyForm.newDay)?.label || copyForm.newDay}</strong></span>
          </div>
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={() => setShowCopyModal(false)}>Cancelar</Button>
          <Button onClick={handleCopyScale}>Copiar</Button>
        </div>
      </Modal>

      <Modal isOpen={showNoticeModal} onClose={() => setShowNoticeModal(false)} title="Novo Aviso" size="md">
        <div className={styles.formGrid}>
          <Input
            label="Título"
            placeholder="Ex: Reunião de Líderes"
            value={noticeForm.title}
            onChange={e => setNoticeForm(p => ({ ...p, title: e.target.value }))}
            fullWidth
          />
          <Input
            label="Descrição"
            placeholder="Detalhes do aviso..."
            value={noticeForm.description}
            onChange={e => setNoticeForm(p => ({ ...p, description: e.target.value }))}
            fullWidth
            multiline={true}
          />
          <Input
            type="date"
            label="Data"
            value={noticeForm.date}
            onChange={e => setNoticeForm(p => ({ ...p, date: e.target.value }))}
            fullWidth
          />
          <div className={styles.selectWrapper}>
            <label className={styles.selectLabel}>Prioridade</label>
            <select
              className={styles.select}
              value={noticeForm.priority}
              onChange={e => setNoticeForm(p => ({ ...p, priority: e.target.value }))}
            >
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div className={styles.fullWidthField}>
            <MultiSelect
              label="Destinatários (Setores)"
              options={[{ id: 'all', name: 'Todos os setores' }, ...sectors]}
              selected={noticeForm.sectors || []}
              onChange={(ids) => {
                if (ids.includes('all') && !noticeForm.sectors?.includes('all')) {
                  setNoticeForm(p => ({ ...p, sectors: ['all'] }));
                } else if (ids.length > 1 && ids.includes('all')) {
                  setNoticeForm(p => ({ ...p, sectors: ids.filter(id => id !== 'all') }));
                } else {
                  setNoticeForm(p => ({ ...p, sectors: ids }));
                }
              }}
              placeholder="Todos os setores"
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={() => setShowNoticeModal(false)}>Cancelar</Button>
          <Button onClick={handleCreateNotice}>Criar Aviso</Button>
        </div>
      </Modal>

      <Modal isOpen={showEditNoticeModal} onClose={() => setShowEditNoticeModal(false)} title="Editar Aviso" size="md">
        <div className={styles.formGrid}>
          <Input
            label="Título"
            placeholder="Ex: Reunião de Líderes"
            value={noticeForm.title}
            onChange={e => setNoticeForm(p => ({ ...p, title: e.target.value }))}
            fullWidth
          />
          <Input
            label="Descrição"
            placeholder="Detalhes do aviso..."
            value={noticeForm.description}
            onChange={e => setNoticeForm(p => ({ ...p, description: e.target.value }))}
            fullWidth
            multiline={true}
          />
          <Input
            type="date"
            label="Data"
            value={noticeForm.date}
            onChange={e => setNoticeForm(p => ({ ...p, date: e.target.value }))}
            fullWidth
          />
          <div className={styles.selectWrapper}>
            <label className={styles.selectLabel}>Prioridade</label>
            <select
              className={styles.select}
              value={noticeForm.priority}
              onChange={e => setNoticeForm(p => ({ ...p, priority: e.target.value }))}
            >
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
          </div>
            <MultiSelect
              label="Destinatários (Setores)"
              options={[{ id: 'all', name: 'Todos os setores' }, ...sectors]}
              selected={noticeForm.sectors || []}
              onChange={(ids) => {
                if (ids.includes('all') && !noticeForm.sectors?.includes('all')) {
                  setNoticeForm(p => ({ ...p, sectors: ['all'] }));
                } else if (ids.length > 1 && ids.includes('all')) {
                  setNoticeForm(p => ({ ...p, sectors: ids.filter(id => id !== 'all') }));
                } else {
                  setNoticeForm(p => ({ ...p, sectors: ids }));
                }
              }}
              placeholder="Todos os setores"
            />
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={() => setShowEditNoticeModal(false)}>Cancelar</Button>
          <Button onClick={handleUpdateNotice}>Salvar Alterações</Button>
        </div>
      </Modal>

      <Modal
        isOpen={showSectorModal}
        onClose={() => setShowSectorModal(false)}
        title="Novo Setor"
      >
        <div className={styles.formGrid}>
          <Input
            label="Nome do Setor"
            placeholder="Ex: Sonorização"
            value={sectorForm.name}
            onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })}
          />
          <Input
            label="Breve Descrição"
            placeholder="O que este setor faz?"
            value={sectorForm.description}
            onChange={(e) => setSectorForm({ ...sectorForm, description: e.target.value })}
            multiline={true}
          />
        </div>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setShowSectorModal(false)}>Cancelar</Button>
          <Button onClick={handleCreateSector}>Criar Setor</Button>
        </div>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedScale(null); }}
        title="Detalhes da Escala"
        size="lg"
      >
        {selectedScale && (
          <div className={styles.detailContent}>
            <div className={styles.detailHeader}>
              <div className={styles.detailDateInfo}>
                <span className={styles.detailDay}>{selectedScale.day}</span>
                <span className={styles.detailDate}>{formatDate(selectedScale.date)}</span>
                <span className={styles.detailTime}>
                  <Clock size={16} />
                  {selectedScale.time}
                </span>
              </div>
              <div className={styles.detailActions}>
                <button className={styles.actionBtn} onClick={handleEditScale}>
                  <Pencil size={16} />
                  Editar
                </button>
                <button className={styles.actionBtn} onClick={() => setShowCopyModal(true)}>
                  <Copy size={16} />
                  Copiar
                </button>
                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDeleteScale(selectedScale.id)}>
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>

            <div className={styles.sectorsGrid}>
              {sectors.map(sector => {
                const names = selectedScale.sectors[sector.id] || [];
                if (names.length === 0) return null;
                return (
                  <div key={sector.id} className={styles.sectorViewCard}>
                    <span className={styles.sectorLabel}>
                      <Users size={12} />
                      {sector.name}
                    </span>
                    <span className={styles.sectorNames}>{names.join(', ')}</span>
                  </div>
                );
              })}
            </div>

            {selectedScale.obs && (
              <div className={styles.obsNote}>
                <AlertCircle size={16} />
                <span>{selectedScale.obs}</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedScale(null); }}
        title="Editar Escala"
        size="xl"
      >
        {selectedScale && (
          <div className={styles.editContent}>
            <div className={styles.detailHeader}>
              <div className={styles.detailDateInfo}>
                <span className={styles.detailDay}>{selectedScale.day}</span>
                <span className={styles.detailDate}>{formatDate(selectedScale.date)}</span>
                <span className={styles.detailTime}>
                  <Clock size={16} />
                  {selectedScale.time}
                </span>
              </div>
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Data"
                type="date"
                value={selectedScale.date}
                onChange={(e) => setSelectedScale({ ...selectedScale, date: e.target.value, day: getDayFromDate(e.target.value) })}
              />
              <div className={styles.autoDayInfo}>
                <Calendar size={16} />
                Dia da semana: <strong>{selectedScale.day}</strong>
              </div>
              <Input
                label="Horário"
                type="time"
                value={selectedScale.time}
                onChange={(e) => setSelectedScale({ ...selectedScale, time: e.target.value })}
              />
              <Input
                label="Observação"
                value={selectedScale.obs || ''}
                onChange={(e) => setSelectedScale({ ...selectedScale, obs: e.target.value })}
              />
            </div>

            <div className={styles.sectorsGrid}>
              {sectors.map(sector => (
                <div key={sector.id} className={styles.sectorEditCard}>
                  <span className={styles.sectorEditName}>
                    <Users size={12} />
                    {sector.name}
                  </span>
                  <MultiSelect
                    options={getUsersBySector(sector.id)}
                    selected={getSelectedUsersBySector(sector.id, selectedScale.sectors[sector.id] || [])}
                    onChange={(ids) => handleUpdateScaleSectorLocally(sector.id, ids)}
                    placeholder="Selecione..."
                  />
                </div>
              ))}
            </div>
            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => { setShowEditModal(false); setShowDetailModal(true); }}>
                Voltar
              </Button>
              <Button onClick={handleUpdateScale}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}