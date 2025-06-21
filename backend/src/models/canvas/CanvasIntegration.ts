interface CanvasIntegration {
  id: string;
  userId: string;
  canvasDomain: string;
  accessToken: string; //encrypt this...
  isActive: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
}
